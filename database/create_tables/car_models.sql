CREATE TABLE car_models (
    car_model_id INTEGER PRIMARY KEY,
    car_model TEXT NOT NULL,
    car_make_id INTEGER NOT NULL,
    FOREIGN KEY (car_make_id) REFERENCES car_makes(car_make_id)
);
