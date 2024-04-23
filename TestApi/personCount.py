def execute(**kwargs):
    # Initialize car count
    total_person_count = 0

    # Iterate through each named argument
    for key, value in kwargs.items():
        # The value should be a dictionary, check if the class_name is 'car'
        if isinstance(value, dict) and value.get('class_name') == 'person':
            # Increment the car count
            total_person_count += 1

    # Return the total car count
    return total_person_count