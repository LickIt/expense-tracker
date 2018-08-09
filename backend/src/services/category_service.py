from sqlalchemy.orm import Session
from typing import Dict, Any
from ..entities import Category, CategorySchema, CategorySchemaType
from .data_service import DataService


class CategoryService(DataService):
    def get_categories_by_user(self, userid: int) -> Dict[str, Any]:
        categories = self.session \
            .query(Category) \
            .filter_by(userid=userid) \
            .order_by(Category.name) \
            .all()

        schema: CategorySchemaType = CategorySchema(many=True)
        return schema.dump(categories).data

    def get_category_by_user(self, id: int, userid: int) -> Dict[str, Any]:
        category = self.session \
            .query(Category) \
            .filter_by(id=id, userid=userid) \
            .first()

        schema: CategorySchemaType = CategorySchema()
        return schema.dump(category).data

    def create_category(self, data: Dict[str, Any]):
        category = Category(**data)

        self.session.add(category)
        self.session.commit()

        schema: CategorySchemaType = CategorySchema()
        return schema.dump(category).data

    def patch_category(self, data: Dict[str, Any]):
        categoryid = data["id"]
        category: Category = self.session \
            .query(Category) \
            .filter_by(id=categoryid) \
            .first()

        patch = Category(**data)
        if patch.name and category.name != patch.name:
            category.name = patch.name

        if "color" in data.keys() and category.color != patch.color:
            category.color = patch.color

        self.session.commit()
        schema: CategorySchemaType = CategorySchema()
        return schema.dump(category).data
