import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';

import styles from './UserSkeletonLoading.module.css';

const UserSkeletonLoading = ({ showLastLabel , showCheckBoxes  }) => {
    const labelCount = showLastLabel ? 3 : 2;
    const checkBoxDiv = (
        <div className={ styles.rightSkeleton }>
            {Array.from({ length: 5 }, (_, i) => (
                <Skeleton.Input
                    key={ i }
                    style={ { width: 200, height: 25, marginTop: 25 } }
                    active
                />
            ))}
        </div>
    );

    return (
        <div className={ styles.skeleton }>
            <div>
                <div className={ styles.flexSkeleton }>
                    <Skeleton active paragraph={ { rows: 1 } } />
                    <div className={ styles.LabelsWrapperSkeleton }>
                        {Array.from({ length: labelCount }, (_, i) => (
                            <div className={ styles.labelsSkeleton } key={ i }>
                                <Skeleton.Input
                                    style={ { width: 200, height: 40 } }
                                    active
                                    size="small"
                                />
                                <Skeleton.Input
                                    style={ { width: 200, height: 40, marginLeft: 50 } }
                                    active
                                    size="small"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={ styles.buttonsSkeleton }>
                    {Array.from({ length: 3 }, (_, i) => (
                        <Skeleton.Input
                            key={ i }
                            style={ { width: 190, height: 45, marginRight: 25, borderRadius: 50 } }
                            active
                        />
                    ))}
                </div>
            </div>
            {showCheckBoxes && checkBoxDiv}
        </div>
    );
};

UserSkeletonLoading.propTypes = {
    showLastLabel: PropTypes.bool,
    showCheckBoxes: PropTypes.bool,
};

UserSkeletonLoading.defaultProps = {
    showLastLabel: true,
    showCheckBoxes: true,
};

export default UserSkeletonLoading;
