CREATE TABLE prices (
    price_id INTEGER PRIMARY KEY,
    service_id INTEGER,
    car_group_id INTEGER,
    wheel_size_id INTEGER,
    wheel_type_id INTEGER,
    price_group_id INTEGER,
    price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (car_group_id) REFERENCES car_groups(car_group_id),
    FOREIGN KEY (wheel_size_id) REFERENCES wheel_sizes(wheel_size_id),
    FOREIGN KEY (wheel_type_id) REFERENCES wheel_types(wheel_type_id),
    FOREIGN KEY (price_group_id) REFERENCES price_group(price_group_id)
);
