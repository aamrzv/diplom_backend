const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");
const { promisify } = require("util");

const db = new sqlite3.Database(dbPath);

// Преобразуем db.run в промис
const all = promisify(db.all).bind(db);

// Функция для выбора списка заказов по идентификатору контрактора
const selectPrices = async (priceGroupId) => {
  priceGroupId = priceGroupId || 1;
  const sql = `
    SELECT	 pg.price_group_id 					      AS priceGroupId
            ,st.service_type_name 				    AS serviceTypeName
            ,COALESCE(st.service_type_id, 0) 	AS serviceTypeId
            ,cg.car_group_name 					      AS carGroupName
            ,COALESCE(p.car_group_id, 0)  		AS carGroupId
            ,wt.wheel_type_name 				      AS wheelTypeName
            ,ws.wheel_size 						        AS wheelSize
            ,COALESCE(p.wheel_size_id, 0) 		AS wheelSizeId
            ,COALESCE(p.service_id, 0) 			  AS serviceId
            ,s.service_name 					        AS serviceName
            ,COALESCE(p.price_id, 0) 			    AS priceId
            ,p.price 
    FROM prices AS p 
    LEFT JOIN price_group 	AS pg ON pg.price_group_id =p.price_group_id 
    LEFT JOIN services 		  AS s  ON s.service_id = p.service_id 
    LEFT JOIN service_types AS st ON st.service_type_id = s.service_type_id 
    LEFT JOIN car_groups 	  AS cg ON cg.car_group_id = p.car_group_id 
    LEFT JOIN wheel_sizes 	AS ws ON ws.wheel_size_id = p.wheel_size_id 
    LEFT JOIN wheel_types 	AS wt ON wt.wheel_type_id = p.wheel_type_id 
    WHERE p.price_group_id = ?
    ORDER BY s.service_display_index, st.service_type_id, s.service_name
  `;

  try {
    const data = await all(sql, [priceGroupId]);
    return data;
  } catch (error) {
    throw new Error(`Error selecting order list: ${error.message}`);
  }
};

// Экспортируем функцию
module.exports = { selectPrices };
