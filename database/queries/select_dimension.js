const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");

// Функция для выбора данных в зависимости от измерения (dimension)
const selectDimension = async (dimension) => {
  let sqlQuery = "";
  switch (dimension) {
    case "car_groups":
      sqlQuery = `
        SELECT car_group_id AS carGroupId,
               car_group_name AS carGroupName,
               car_group_description AS carGroupDescription,
               0 AS isSelect
        FROM car_groups;
      `;
      break;
    case "wheel_sizes":
      sqlQuery = `
        SELECT wheel_size_id AS wheelSizeId,
               wheel_size AS wheelSize,
               0 AS isSelect
        FROM wheel_sizes;
      `;
      break;
    case "services":
      sqlQuery = `
        SELECT service_id AS serviceId,
               service_name AS serviceName,
               0 AS isSelect
        FROM services
        ORDER BY service_display_index, service_type_id;
      `;
      break;
    case "contractors":
      sqlQuery = `
        SELECT   DISTINCT 
         cc.contractor  AS contractorId
        ,cc.contractor     AS contractorName
        ,COALESCE(cct.price_group_id, 0) AS priceGroupId
        ,false AS isSelect
FROM contractors AS cc
LEFT JOIN contracts AS cct ON cct.contractor_id = cc.contractor_id
WHERE cct.is_active = 1 
      `;
      break;
    case "cars":
      sqlQuery = `
       SELECT    crs.car_id     AS carId
                ,crs.car_license_plate   AS carNumber
                ,c.contractor_id  AS contractorId
                ,c.contractor  AS contractor
                ,COALESCE(cls.client_id, 0)   AS clientId
                ,cm.car_make || ' ' || cml.car_model AS car
                ,false AS isSelect
        FROM cars AS crs
        LEFT JOIN contractors c ON c.contractor_id = crs.owner_id 
        LEFT JOIN clients cls ON cls.client_id = crs.owner_id 
        LEFT JOIN car_makes cm ON cm.car_make_id = crs.car_make_id 
        LEFT JOIN car_models cml  ON cml.car_model_id  = crs.car_model_id
      `;
      break;
    default:
      throw new Error(`Invalid dimension: ${dimension}`);
  }

  const data = await new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
    db.close();
  });

  return data;
};

module.exports = { selectDimension };
