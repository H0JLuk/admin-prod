import React from 'react';
import { Skeleton } from 'antd';

import styles from './UserSkeletonLoading.module.css';

const titleStyle = { width: 400, height: 40 };
const inputsStyle = { height: 25 };
const blockTitleStyle = { height: 25 };
const checkboxStyle = { height: 25 };
const buttonsStyle = { height: 35 };
const secondWrapperStyle = { height: 220 };

const UserSkeletonLoading = () => (
    <div className={ styles.skeleton }>
        <Skeleton.Input style={ titleStyle } active size="small" />
        <div className={ styles.mainBlock }>
            <div className={ styles.labelsWrapperSkeleton }>
                { Array.from({ length: 3 }, (_, i) => (
                    <div className={ styles.labelsSkeleton } key={ i }>
                        <Skeleton.Input style={ inputsStyle } active size="small" />
                        <Skeleton.Input style={ inputsStyle } active size="small" />
                    </div>
                )) }
            </div>
            { /* <div className={ styles.labelsWrapperSkeleton }>
                { Array.from({ length: 1 }, (_, i) => (
                    <div className={ styles.labelsSkeleton } key={ i }>
                        <Skeleton.Input style={ inputsStyle } active size="small" />
                        <Skeleton.Input style={ inputsStyle } active size="small" />
                    </div>
                )) }
            </div> */ }
        </div>
        <div className={ styles.mainBlock }>
            <div className={ styles.labelsWrapperSkeleton } style={ secondWrapperStyle }>
                <div className={ styles.skeletonCheckBox }>
                    <div>
                        <Skeleton.Input style={ blockTitleStyle } active size="small" />
                    </div>
                    <div>
                        { Array.from({ length: 3 }, (_, i) => (
                            <Skeleton.Input key={ i } style={ checkboxStyle } active size="small" />
                        )) }
                    </div>
                    <div>
                        { Array.from({ length: 3 }, (_, i) => (
                            <Skeleton.Input key={ i } style={ checkboxStyle } active size="small" />
                        )) }
                    </div>
                    <div>
                        { Array.from({ length: 3 }, (_, i) => (
                            <Skeleton.Input key={ i } style={ checkboxStyle } active size="small" />
                        )) }
                    </div>
                </div>
            </div>
        </div>
        <div className={ styles.buttonsSkeleton }>
            { Array.from({ length: 3 }, (_, i) => (
                <Skeleton.Input key={ i } style={ buttonsStyle } active />
            )) }
        </div>
    </div>
);

export default UserSkeletonLoading;
