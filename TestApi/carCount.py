def execute(**kwargs):

    total_car_count = 0

    for key, value in kwargs.items():
        if isinstance(value, dict) and value.get('class_name') == 'car':
            total_car_count += 1

    return total_car_count