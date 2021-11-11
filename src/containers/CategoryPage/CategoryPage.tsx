import React, { Component } from 'react';
import { uploadFile, swapPositions } from '@apiServices/adminService';
import {
    addCategory,
    deleteCategory,
    getCategoryList,
    updateCategory,
} from '@apiServices/categoryService';
import { getStaticUrl } from '@apiServices/settingsService';
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import Header from '@components/Header';
import { Errors, getErrorText } from '@constants/errors';
import CategoryItem from '@components/CategoryItem';
import { movementDirections } from '@constants/movementDirections';
import styles from './CategoryPage.module.css';
import { addBodyClassForSidebar, removeBodyClassForSidebar } from '@hooks/useBodyClassForSidebar';
import { CategoryDto } from '@types';
import { BUTTON_TEXT } from '@constants/common';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import UploadPicture from '@components/UploadPicture';

const CATEGORIES_GET_ERROR = 'Ошибка получения категорий!';
const CATEGORY_DELETE_ERROR = 'Ошибка удаления категории!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const ADD_CATEGORY_TITLE = 'Добавить категорию';
const REMOVE_QUESTION = 'Удалить категорию?';
const CATEGORY_LIST_TITLE = 'Список категорий';
const LOADING_LIST_LABEL = 'Загрузка';
const CATEGORY_DIR = 'category';
const CATEGORY_MOVE_ERROR = 'Ошибка изменения порядка категорий';

const DEFAULT_EDIT_CAT_STATE = {
    id: null,
    name: null,
    url: null,
    active: null,
};

const LoadingStatus: React.FC<{ loading?: boolean; }> = ({ loading }) => (
    <p className={styles.loadingLabel}>{loading ? LOADING_LIST_LABEL : CATEGORIES_GET_ERROR}</p>
);

type FormValues = {
    categoryName: string;
    active: boolean;
    categoryUrl: string | UploadFile[];
};

type CategoryPageState = {
    editingCategory: {
        id: number | null;
        name: string | null;
        url: string | null;
        active: boolean | null;
    };
    staticUrl: string | null;
    categories: CategoryDto[];
    isOpen: boolean;
    formError: Errors | null;
};

class CategoryPage extends Component<Record<string, unknown>, CategoryPageState> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            editingCategory: DEFAULT_EDIT_CAT_STATE,
            staticUrl: getStaticUrl(),
            categories: [],
            isOpen: false,
            formError: null,
        };
    }

    componentDidMount() {
        addBodyClassForSidebar();
        const loadData = async () => {
            const { categoryList: categories = [] } = await getCategoryList() ?? {};
            this.setState({ categories });
        };
        loadData();
    }

    componentWillUnmount() {
        removeBodyClassForSidebar();
    }

    clearState = () => this.setState({
        editingCategory: { ...DEFAULT_EDIT_CAT_STATE },
    });

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false }, this.clearState);

    handleDelete = (id: number) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteCategory(id).then(() => {
                const croppedCategories = this.state.categories.filter(category => category.categoryId !== id);
                this.setState({ categories: croppedCategories });
            }).catch(() => alert(CATEGORY_DELETE_ERROR));
        }
    };

    handleEdit = (id: number, name: string, url: string, active: boolean) => this.setState({
        editingCategory: { id, name, url, active },
    }, this.openModal);

    handleMove = (id: number, direction: movementDirections) => {
        const { categories } = this.state;
        const position = categories.findIndex((i) => i.categoryId === id);
        if (position < 0) {
            throw new Error('Given item not found.');
        } else if (
            (direction === movementDirections.UP && position === 0) ||
            (direction === movementDirections.DOWN && position === categories.length - 1)
        ) {
            return;
        }
        const item = categories[position];
        const newCategories = categories.filter((i) => i.categoryId !== id);
        newCategories.splice(position + direction, 0, item);
        swapPositions(id, categories[position + direction].categoryId, CATEGORY_DIR).then(() => {
            this.setState({ categories: newCategories });
        }).catch(() => alert(CATEGORY_MOVE_ERROR));
    };

    renderModalForm = () => {
        const { formError, editingCategory: { id, name, active, url } } = this.state;

        return (
            <div className={styles.modalForm}>
                <Form
                    className={styles.categoryForm}
                    layout="vertical"
                    validateTrigger="onSubmit"
                    onFinish={this.onSubmit}
                >
                    <Form.Item
                        name="categoryName"
                        label="Имя категории"
                        rules={[
                            FORM_RULES.REQUIRED,
                            {
                                ...getPatternAndMessage('category', 'name'),
                            },
                        ]}
                        initialValue={name ?? ''}
                        validateFirst
                    >
                        <Input maxLength={2048} />
                    </Form.Item>
                    <Form.Item
                        name="active"
                        label="Активность"
                        initialValue={id == null ? true : !!active}
                        valuePropName="checked"
                    >
                        <Checkbox disabled={id === null} />
                    </Form.Item>

                    <UploadPicture
                        name="categoryUrl"
                        label="Изображение категории"
                        initialValue={url || []}
                        rules={[FORM_RULES.REQUIRED]}
                        type="logo"
                        removeIconView={false}
                        accept=".png, .jpg, .jpeg, .svg"
                        footer
                    />

                    {formError && <p className={styles.error}>{getErrorText(formError)}</p>}

                    <Button
                        className={styles.categoryForm__button}
                        type="primary"
                        htmlType="submit"
                    >
                        {BUTTON_TEXT.SAVE}
                    </Button>
                </Form>
            </div>
        );
    };

    reloadCategory({ categoryName, categoryUrl, active }: CategoryDto) {
        const { categories, staticUrl, editingCategory: { id } } = this.state;
        const newCategories = categories.map(elem => {
            if (elem.categoryId === id) {
                return {
                    ...elem,
                    categoryName,
                    categoryUrl: `${(staticUrl || '')}${categoryUrl}`,
                    active,
                };
            }

            return elem;
        });
        this.setState({ categories: newCategories }, this.closeModal);
    }

    pushToCategoriesList(categoryId: number, categoryDto: CategoryDto) {
        const newCategoryItem = {
            ...categoryDto,
            categoryUrl: (this.state.staticUrl || '') + categoryDto.categoryUrl,
            dzoList: null,
            active: true,
            categoryId,
        };
        const categories = [newCategoryItem, ...this.state.categories];
        this.setState({ categories }, this.closeModal);
    }

    onSubmit = async ({ categoryUrl, ...data }: FormValues) => {
        let imageUrl = categoryUrl;
        let categoryId = this.state.editingCategory.id;

        try {
            if (typeof imageUrl !== 'string') {
                try {
                    const imageFile = imageUrl[0].originFileObj!;
                    const imageName = `${ CATEGORY_DIR }/${ imageFile.name.replace(/\s/g, '_').replace(/[()]+/g, '') }`;
                    const { path } = await uploadFile(imageFile, imageName);
                    imageUrl = path;
                } catch (err) {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.error(err.message);
                }
            } else {
                imageUrl = this.state.editingCategory.url?.slice((this.state.staticUrl || '').length) ?? '';
            }

            const categoryDto = {
                ...data,
                categoryUrl: imageUrl,
            } as CategoryDto;

            if (categoryId !== null) {
                await updateCategory(categoryId, categoryDto);
                this.reloadCategory(categoryDto);
            } else {
                ({ id: categoryId } = await addCategory(categoryDto));
                this.pushToCategoriesList(categoryId, categoryDto);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    renderCategoriesList = () => {
        const { categories } = this.state;
        const isSuccess = Array.isArray(categories);
        return isSuccess ? (
            categories.length ?
                categories.map((category, i) => (
                    <CategoryItem
                        key={`categoryItem-${i}`}
                        handleDelete={this.handleDelete}
                        handleEdit={this.handleEdit}
                        handleMove={this.handleMove}
                        {...category}
                    />
                )) : <LoadingStatus loading />
        ) : (
            <LoadingStatus />
        );
    };

    renderModifyModal = () => (
        <Modal
            visible={this.state.isOpen}
            onCancel={this.closeModal}
            footer={null}
            destroyOnClose
        >
            {this.renderModalForm()}
        </Modal>
    );

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={styles.categoryPageWrapper}>
                <Header buttonBack={false} />
                {this.renderModifyModal()}
                <div className={styles.headerSection}>
                    <h3>{CATEGORY_LIST_TITLE}</h3>
                    <div>
                        <Button type="primary" onClick={openWithParam}>
                            {ADD_CATEGORY_TITLE}
                        </Button>
                    </div>
                </div>
                <div className={styles.content}>
                    {this.renderCategoriesList()}
                </div>
            </div>
        );
    }
}

export default CategoryPage;
