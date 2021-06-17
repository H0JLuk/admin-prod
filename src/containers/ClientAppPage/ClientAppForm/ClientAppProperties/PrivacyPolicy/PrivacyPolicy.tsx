import React from 'react';
import { Button, Col, Row } from 'antd';
import { Link, generatePath, useHistory } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons/';

import { getPathForConsentInfo, getPathForConsentsList } from '@utils/appNavigation';
import { PRIVACY_POLICY } from '../../ClientAppFormConstants';
import { getFormattedDate } from '@utils/helper';
import { ConsentDto } from '@types';

import styles from './PrivacyPolicy.module.css';

type PrivacyPolicyProps = {
    consent: ConsentDto | null;
};

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ consent }) => {
    const history = useHistory();

    const redirectToConsentsList = () => {
        history.push(getPathForConsentsList());
    };

    if (!consent) {
        return (
            <>
                <div>
                    <i>{PRIVACY_POLICY.EMPTY_CONSENTS}</i>
                </div>
                <Button className={styles.consentButton} onClick={redirectToConsentsList}>
                    {PRIVACY_POLICY.TO_CONSENTS_LIST}
                </Button>
            </>
        );
    }

    const { id, createDate, version } = consent;
    const startDate = getFormattedDate(createDate, 'DD MMMM YYYY');

    return (
        <Row gutter={12}>
            <Col>
                <FileTextOutlined className={styles.icon} />
            </Col>
            <Col>
                <div className={styles.privacyTitle}>
                    {PRIVACY_POLICY.TITLE}
                </div>
                <Row className={styles.consentInfo} gutter={20}>
                    <Col>
                        {`${PRIVACY_POLICY.VERSION}: ${version}`}
                    </Col>
                    <Col>
                        {`${PRIVACY_POLICY.START_DATE}: ${startDate}`}
                    </Col>
                </Row>
                <Row>
                    <Link className={styles.link} to={generatePath(getPathForConsentInfo(), { consentId: id })}>
                        {PRIVACY_POLICY.DETAILS}
                    </Link>
                </Row>
            </Col>
        </Row>
    );
};

export default PrivacyPolicy;
