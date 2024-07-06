CREATE TABLE cars (
    car_id INTEGER PRIMARY KEY,
    car_license_plate TEXT NOT NULL,
    car_make_id INTEGER NOT NULL,
    car_model_id INTEGER NOT NULL,
    owner_id INTEGER NOT NULL, -- Идентификатор владельца автомобиля (клиента или контрагента)
    is_active INTEGER NOT NULL,
    FOREIGN KEY (car_make_id) REFERENCES car_makes(car_make_id),
    FOREIGN KEY (car_model_id) REFERENCES car_models(car_model_id)
);
