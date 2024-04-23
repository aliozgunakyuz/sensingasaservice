def execute(**kwargs):
    
    total_person_count = 0
    for key, value in kwargs.items():
        if isinstance(value, dict) and value.get('class_name') == 'person':

            total_person_count += 1

    return total_person_count