import React, { Component, Fragment } from 'react';
import { uploadFile, swapPositions } from '@apiServices/adminService';
import {
    addCategory,
    deleteCategory,
    getCategoryList,
    updateCategory
} from '@apiServices/categoryService';
import { getStaticUrl } from '@apiServices/settingsService';
import { Button } from 'antd';
import { CATEGORY_FORM } from '@components/Form/forms';
import Header from '@components/Header';
import { Errors, getErrorText } from '@constants/errors';
import CustomModal from '@components/CustomModal';
import CategoryItem from '@components/CategoryItem';
import { movementDirections } from '@constants/movementDirections';
import Form from '@components/Form';
import cross from '@imgs/cross.svg';
import styles from './CategoryPage.module.css';
import { populateFormWithData } from '@components/Form/formHelper';
import ButtonLabels from '@components/Button/ButtonLables';
import { getAppCode } from '@apiServices/sessionService';
import { addBodyClassForSidebar, removeBodyClassForSidebar } from '@hooks/useBodyClassForSidebar';
import { CategoryDto, DefaultCreateDtoResponse } from '@types';


const CATEGORIES_GET_ERROR = 'Ошибка получения категорий!';
const CATEGORY_DELETE_ERROR = 'Ошибка удаления категории!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const ADD_CATEGORY_TITLE = 'Добавить категорию';
const REMOVE_QUESTION = 'Удалить категорию?';
const CATEGORY_LIST_TITLE = 'Список категорий';
const LOADING_LIST_LABEL = 'Загрузка';
const UPLOAD_IMAGE_PLEASE = 'Пожалуйста загрузите изображение!';
const CATEGORY_DIR = 'category';
const CATEGORY_MOVE_ERROR = 'Ошибка изменения порядка категорий';

const LoadingStatus: React.FC<{ loading?: boolean; }> = ({ loading }) => (
    <p className={styles.loadingLabel}>{loading ? LOADING_LIST_LABEL : CATEGORIES_GET_ERROR}</p>
);

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
    categoryRef: React.RefObject<HTMLInputElement>;

    constructor(props: Record<string, unknown>) {
        super(props);
        this.categoryRef = React.createRef();
        this.state = {
            editingCategory: {
                id: null,
                name: null,
                url: null,
                active: null,
            },
            staticUrl: getStaticUrl(),
            categories: [],
            isOpen: false,
            formError: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
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
        editingCategory: { id: null, name: null, url: null, active: null }
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
        editingCategory: { id, name, url, active }
    }, this.openModal);

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            editingCategory: { ...this.state.editingCategory, active: value as boolean }
        });
    }

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
        const { formError, editingCategory: { id, name, active } } = this.state;
        const formData = id != null
            ? populateFormWithData(CATEGORY_FORM, { categoryName: name })
            : CATEGORY_FORM;
        return (
            <div className={styles.modalForm}>
                <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt={ButtonLabels.CLOSE} />
                <Form
                    data={formData}
                    buttonText={ButtonLabels.SAVE}
                    onSubmit={this.onSubmit}
                    formClassName={styles.categoryForm}
                    fieldClassName={styles.categoryForm__field}
                    activeLabelClassName={styles.categoryForm__field__activeLabel}
                    buttonClassName={styles.categoryForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                <form className={styles.categoryForm}>
                    <label className={styles.categoryForm__field} >
                        Is Active:
                    </label>
                    <input
                        name="Active"
                        type="checkbox"
                        disabled={id == null}
                        checked={id == null ? true : !!active}
                        onChange={this.handleInputChange}
                    />
                </form>
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="categoryImageInput">Изображение категории</label>
                    <input type="file" id="categoryImageInput" ref={this.categoryRef} className={styles.imageUpload} />
                </form>
            </div>
        );
    };

    reloadCategory(categoryDto: CategoryDto) {
        const { categories, staticUrl, editingCategory: { id, url, active } } = this.state;
        const newCategories = categories.slice();
        newCategories.forEach(elem => {
            if (elem.categoryId === id) {
                if (this.categoryRef.current?.files?.length && elem.categoryUrl === url) {
                    elem.categoryUrl = '';
                    this.setState({ categories: newCategories });
                }
                elem.categoryName = categoryDto.categoryName;
                elem.categoryUrl = (staticUrl || '') + categoryDto.categoryUrl;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                elem.active = active!;
            }
        });
        this.setState({ categories: newCategories }, this.closeModal);
    }

    pushToCategoriesList(categoryResponse: DefaultCreateDtoResponse, categoryDto: CategoryDto) {
        const { id } = categoryResponse;
        const newCategoryItem = {
            ...categoryDto,
            categoryUrl: (this.state.staticUrl || '') + categoryDto.categoryUrl,
            dzoList: null, active: true, categoryId: id
        };
        const categories = [newCategoryItem, ...this.state.categories];
        this.setState({ categories }, this.closeModal);
    }

    onSubmit = (data: Record<string, string>) => {
        if (!this.categoryRef.current?.files?.length && !this.state.editingCategory.url) {
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        let categoryDto: CategoryDto;
        if (!this.categoryRef.current?.files?.length && this.state.editingCategory.id !== null) {
            categoryDto = {
                ...data,
                active: !!this.state.editingCategory.active,
                categoryUrl: this.state.editingCategory.url?.slice((this.state.staticUrl || '').length)
            } as CategoryDto;
            updateCategory(this.state.editingCategory.id, categoryDto).then(() => {
                this.reloadCategory(categoryDto);
            }).catch(error => console.error(error.message));
        } else {
            const imageFile = this.categoryRef.current?.files?.[0];
            const imageName = `${ getAppCode() }/${ CATEGORY_DIR }/${ imageFile?.name }`;

            if (!imageFile) {
                return;
            }

            uploadFile(imageFile, imageName)
                .then((response) => {
                    categoryDto = { ...data, active: !!this.state.editingCategory.active, categoryUrl: response.path } as CategoryDto;
                    if (this.state.editingCategory.id !== null) {
                        return updateCategory(this.state.editingCategory.id, categoryDto);
                    } else {
                        return addCategory(categoryDto);
                    }
                })
                .then((categoryId) => {
                    if (this.state.editingCategory.id !== null) {
                        this.reloadCategory(categoryDto);
                    } else {
                        this.pushToCategoriesList(categoryId as DefaultCreateDtoResponse, categoryDto);
                    }
                })
                .catch(error => {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.error(error.message);
                });
        }
    };

    renderCategoriesList = () => {
        const { categories } = this.state;
        const isSuccess = Array.isArray(categories);
        return (
            <Fragment>
                {isSuccess ? (
                    categories.length ?
                        categories.map((category, i) =>
                            <CategoryItem
                                key={`categoryItem-${i}`}
                                handleDelete={this.handleDelete}
                                handleEdit={this.handleEdit}
                                handleMove={this.handleMove}
                                {...category}
                            />
                        ) : <LoadingStatus loading />
                ) : (
                    <LoadingStatus />
                )}
            </Fragment>
        );
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}>
            {this.renderModalForm()}
        </CustomModal>
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
