import React, { useCallback, useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { Markup } from 'interweave';
import { generatePath, useHistory, useParams } from 'react-router-dom';

import Header from '@components/Header';
import { getFormattedDate } from '@utils/helper';
import { CONSENTS_PAGES } from '@constants/route';
import Loading from '@components/Loading';
import { getRole } from '@apiServices/sessionService';
import { confirmModal, errorModal, successModal } from '@utils/utils';
import { deleteConsent, getConsentById } from '@apiServices/consentsService';
import { BUTTON_TEXT, CONSENTS_LABELS, EMPTY_VALUE } from '@constants/consentsConstants';
import { ROLES } from '@constants/roles';
import { ConsentDto } from '@types';

import styles from './ConsentInfo.module.css';

type ConsentInfoProps = {
    matchPath: string;
};

const ConsentInfo: React.FC<ConsentInfoProps> = ({ matchPath }) => {
    const role = getRole();
    const history = useHistory();
    const { consentId } = useParams<{ consentId: string; }>();
    const [loading, setLoading] = useState(true);
    const [consentData, setConsentData] = useState({} as ConsentDto);

    const redirectToConsentsList = () => history.push(matchPath);

    const loadData = useCallback(async () => {
        try {
            const consent = await getConsentById(+consentId);
            if (!consent) {
                message.error(`Согласие с id ${consentId} отсутствует`);
                redirectToConsentsList();
                return;
            }
            setConsentData(consent);
        } catch (e) {
            console.warn(e);
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!consentId) {
            redirectToConsentsList();
            return;
        }
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadData]);

    const { id, text, version, createDate, clientApplications = [] } = consentData;
    const buttonsVisibility = role === ROLES.ADMIN;

    const onEdit = () => {
        history.push(generatePath(`${matchPath}${CONSENTS_PAGES.EDIT_CONSENT}`, { consentId: id }), { consentData });
    };

    const onDelete = async () => {
        try {
            await deleteConsent(id);
            successModal({
                onOk: redirectToConsentsList,
                title: <span>Согласие <b>{version}</b> успешно удалено</span>,
                okText: BUTTON_TEXT.OK,
            });
        } catch (e) {
            const { message } = e;
            errorModal({
                title: (
                    <span>
                        {CONSENTS_LABELS.ERROR_DELETE}
                        <span className={styles.errorMessage}>
                            {message}
                        </span>
                    </span>
                ),
            });
            console.warn(e);
        }
    };

    const onDeleteClick = () => {
        confirmModal({
            onOk: onDelete,
            title: <span>Вы уверены что хотите удалить согласие <b>{version}</b>?</span>,
            okText: BUTTON_TEXT.DELETE,
            okButtonProps: { danger: true },
        });
    };

    return (
        <>
            <Header />
            {loading
                ? <Loading />
                : (
                    <>
                        <div className={styles.header}>
                            <div className={styles.headerTitle}>
                                {`${CONSENTS_LABELS.INFO_TITLE} ${version}`}
                            </div>
                            {buttonsVisibility && (
                                <div className={styles.buttons}>
                                    <Button
                                        type="primary"
                                        onClick={onEdit}
                                    >
                                        {BUTTON_TEXT.EDIT}
                                    </Button>
                                    {!clientApplications.length && (
                                        <Button
                                            type="primary"
                                            onClick={onDeleteClick}
                                            danger
                                        >
                                            {BUTTON_TEXT.DELETE}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.container}>
                            <div className={styles.infoWrapper}>
                                <div className={styles.infoContainer}>
                                    <div className={styles.title}>
                                        {CONSENTS_LABELS.CREATE_DATE}
                                    </div>
                                    <div className={styles.text}>
                                        {getFormattedDate(createDate)}
                                    </div>
                                    <div className={styles.title}>
                                        {CONSENTS_LABELS.VERSION}
                                    </div>
                                    <div className={styles.text}>
                                        {version}
                                    </div>
                                    <div className={styles.title}>
                                        {CONSENTS_LABELS.CONSENTS_TEXT}
                                    </div>
                                    <Markup allowAttributes content={text} />
                                    <div className={styles.title}>
                                        {CONSENTS_LABELS.CONSENTS_APPS}
                                    </div>
                                    <div className={styles.tagsBlock}>
                                        {clientApplications.length > 0
                                            ? clientApplications.map(({ displayName, id }) => (
                                                <div key={id} className={styles.tag}>
                                                    {displayName}
                                                </div>
                                            )) : <i>{EMPTY_VALUE[CONSENTS_LABELS.CLIENT_APPS_DTO_LIST]}</i>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    );
};

export default ConsentInfo;
