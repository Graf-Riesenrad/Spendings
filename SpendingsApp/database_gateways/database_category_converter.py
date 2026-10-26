

from SpendingsApp.finance.category_data import CategoryData
from SpendingsApp.models import Category
from SpendingsApp.request_data_preparation.category_converter import CategoryConverter


class DatabaseCategoryConverter(CategoryConverter):
    def convert_to_category(self, input: any) -> CategoryData:
        if isinstance(input, CategoryData):
            return input

        category = self._read_from_database(input)
        return CategoryData(id=category.id, name=category.name)
    

    def _read_from_database(self, input: any) -> Category:
        try:
            return self._try_options(input)
        except:
            message = f"Cannot convert '{input}' to Category. Expected either a Category, an int, a str or a dict with 'id' or 'name' key."
            raise ValueError(message)
        
    
    def _try_options(self, input) -> Category:
        if isinstance(input, Category):
            return input

        try:
            return Category.objects.get(id=int(input))
        except:
            pass
        
        if isinstance(input, str):
            return Category.objects.get(name=input)
        
        if isinstance(input, dict):
            if 'id' in input:
                return Category.objects.get(id=input['id'])
            if 'name' in input:
                return Category.objects.get(name=input['name'])
        
        raise ValueError()