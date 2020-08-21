import React from 'react';

const auditEventTypes = ['LOGIN',
'LOGOUT',
'FILE_UPLOAD',
'OFFERS_EXPORT',
'FEEDBACKS_EXPORT',
'APPLICATION_URL_EDIT',
'DZO_ADD',
'DZO_EDIT',
'DZO_DELETE',
'LANDING_ADD',
'LANDING_EDIT',
'LANDING_DELETE',
'CATEGORY_ADD',
'CATEGORY_EDIT',
'CATEGORY_DELETE',
'BANNER_ADD',
'BANNER_EDIT',
'BANNER_DELETE',
'OFFER_ADD',
'SMS_SEND',
'REGISTER_CLIENT',
'REGISTER_PROMO_CAMPAIGN_CLIENT']

export default function SelectColumnFilter({
                                column: { filterValue, setFilter, id },
                            }) {
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">Все</option>
            {auditEventTypes.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}
