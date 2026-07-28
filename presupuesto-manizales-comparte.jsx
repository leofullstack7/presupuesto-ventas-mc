import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";


const RAW_DATA = {"items": [{"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Recorrido de los colonizadores", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 100000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 100000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 100000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 15, "precio": 100000, "ingresos": 1500000, "egresos": 1050000, "utilidad": 450000}, "Noviembre": {"q": 0, "precio": 100000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 15, "precio": 100000, "ingresos": 1500000, "egresos": 1050000, "utilidad": 450000}}}, {"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Recorrido de  los fundadores", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 15, "precio": 120000, "ingresos": 1800000, "egresos": 1260000, "utilidad": 540000}, "Noviembre": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 15, "precio": 120000, "ingresos": 1800000, "egresos": 1260000, "utilidad": 540000}}}, {"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Recorrido de  los arrieros", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 1, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 1, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 1, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 1, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 1, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 1, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Coffee tour", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 250000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 20, "precio": 250000, "ingresos": 5000000, "egresos": 3500000, "utilidad": 1500000}, "Septiembre": {"q": 0, "precio": 250000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 250000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 250000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 20, "precio": 250000, "ingresos": 5000000, "egresos": 3500000, "utilidad": 1500000}}}, {"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Fraile tour", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 20, "precio": 290000, "ingresos": 5800000, "egresos": 4060000.0, "utilidad": 1740000.0}, "Agosto": {"q": 0, "precio": 290000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 20, "precio": 290000, "ingresos": 5800000, "egresos": 4060000.0, "utilidad": 1740000.0}, "Octubre": {"q": 0, "precio": 290000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 290000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 290000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Cacaotour", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 270000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 270000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 20, "precio": 270000, "ingresos": 5400000, "egresos": 3780000.0, "utilidad": 1620000.0}, "Octubre": {"q": 20, "precio": 270000, "ingresos": 5400000, "egresos": 3780000.0, "utilidad": 1620000.0}, "Noviembre": {"q": 0, "precio": 270000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 270000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "TURISMO", "linea": "La ruta de nuestra historia", "referencia": "Personalizado", "um": "Tickets", "margen": 0.3, "meses": {"Julio": {"q": 4, "precio": 150000, "ingresos": 600000, "egresos": 420000, "utilidad": 180000}, "Agosto": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 4, "precio": 150000, "ingresos": 600000, "egresos": 420000, "utilidad": 180000}, "Octubre": {"q": 4, "precio": 150000, "ingresos": 600000, "egresos": 420000, "utilidad": 180000}, "Noviembre": {"q": 4, "precio": 150000, "ingresos": 600000, "egresos": 420000, "utilidad": 180000}, "Diciembre": {"q": 4, "precio": 150000, "ingresos": 600000, "egresos": 420000, "utilidad": 180000}}}, {"unidad": "EDUCACION", "linea": "Manizales es el aula", "referencia": "Circuito manizales innovadora", "um": "Circuitos", "margen": 0.2, "meses": {"Julio": {"q": 0, "precio": 130000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 130000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 130000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 130000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 130000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 130000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "EDUCACION", "linea": "Manizales es el aula", "referencia": "Circuito manizales historia y patrimonio", "um": "Circuitos", "margen": 0.2, "meses": {"Julio": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "EDUCACION", "linea": "Manizales es el aula", "referencia": "Circuito manizales al natural", "um": "Circuitos", "margen": 0.2, "meses": {"Julio": {"q": 0, "precio": 168500, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 168500, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 168500, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 168500, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 168500, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 168500, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "MERCH", "linea": "La tienda del arte", "referencia": "Minireplica en caja", "um": "Unidades", "margen": 0.3, "meses": {"Julio": {"q": 24, "precio": 150000, "ingresos": 3600000, "egresos": 2520000, "utilidad": 1080000}, "Agosto": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 150000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "MERCH", "linea": "La tienda del arte", "referencia": "Minireplica en bolsa", "um": "Unidades", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 6, "precio": 120000, "ingresos": 720000, "egresos": 504000.0, "utilidad": 216000.0}, "Noviembre": {"q": 0, "precio": 120000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 6, "precio": 120000, "ingresos": 720000, "egresos": 504000.0, "utilidad": 216000.0}}}, {"unidad": "MERCH", "linea": "La tienda del arte", "referencia": "Tapitas manizaleñas", "um": "Unidades", "margen": 0.3, "meses": {"Julio": {"q": 30, "precio": 17000, "ingresos": 510000, "egresos": 357000, "utilidad": 153000}, "Agosto": {"q": 50, "precio": 17000, "ingresos": 850000, "egresos": 595000, "utilidad": 255000}, "Septiembre": {"q": 70, "precio": 17000, "ingresos": 1190000, "egresos": 833000, "utilidad": 357000}, "Octubre": {"q": 100, "precio": 17000, "ingresos": 1700000, "egresos": 1190000, "utilidad": 510000}, "Noviembre": {"q": 150, "precio": 17000, "ingresos": 2550000, "egresos": 1785000, "utilidad": 765000}, "Diciembre": {"q": 200, "precio": 17000, "ingresos": 3400000, "egresos": 2380000, "utilidad": 1020000}}}, {"unidad": "CORPORATIVA", "linea": "Estaciones historicas                       (Manholes)", "referencia": "Oro", "um": "Paquetes", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 1, "precio": 50000000, "ingresos": 50000000, "egresos": 35000000, "utilidad": 15000000}, "Noviembre": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 1, "precio": 50000000, "ingresos": 50000000, "egresos": 35000000, "utilidad": 15000000}}}, {"unidad": "CORPORATIVA", "linea": "Estaciones historicas                       (Manholes)", "referencia": "Plata", "um": "Paquetes", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 1, "precio": 30000000, "ingresos": 30000000, "egresos": 21000000, "utilidad": 9000000}, "Septiembre": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 1, "precio": 30000000, "ingresos": 30000000, "egresos": 21000000, "utilidad": 9000000}, "Diciembre": {"q": 1, "precio": 30000000, "ingresos": 30000000, "egresos": 21000000, "utilidad": 9000000}}}, {"unidad": "CORPORATIVA", "linea": "Estaciones historicas                       (Manholes)", "referencia": "Bronce", "um": "Paquetes", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 10000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 1, "precio": 10000000, "ingresos": 10000000, "egresos": 7000000, "utilidad": 3000000}, "Septiembre": {"q": 1, "precio": 10000000, "ingresos": 10000000, "egresos": 7000000, "utilidad": 3000000}, "Octubre": {"q": 1, "precio": 10000000, "ingresos": 10000000, "egresos": 7000000, "utilidad": 3000000}, "Noviembre": {"q": 1, "precio": 10000000, "ingresos": 10000000, "egresos": 7000000, "utilidad": 3000000}, "Diciembre": {"q": 1, "precio": 10000000, "ingresos": 10000000, "egresos": 7000000, "utilidad": 3000000}}}, {"unidad": "SOCIAL", "linea": "Ecosistema social                            (Destapa tu corazón)", "referencia": "Imaginarte", "um": "Patrocinio", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "SOCIAL", "linea": "Ecosistema social                            (Destapa tu corazón)", "referencia": "Cuidarte", "um": "Patrocinio", "margen": 0.3, "meses": {"Julio": {"q": 1, "precio": null, "ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Agosto": {"q": 1, "precio": null, "ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Septiembre": {"q": 1, "precio": null, "ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Octubre": {"q": 2, "precio": null, "ingresos": 6000000, "egresos": 4200000, "utilidad": 1800000}, "Noviembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "SOCIAL", "linea": "Ecosistema social                            (Destapa tu corazón)", "referencia": "Salvarte", "um": "Patrocinio", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "SOCIAL", "linea": "Ecosistema social                            (Destapa tu corazón)", "referencia": "Desarmarte", "um": "Patrocinio", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": null, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 2, "precio": null, "ingresos": 6000000, "egresos": 4200000, "utilidad": 1800000}, "Diciembre": {"q": 3, "precio": null, "ingresos": 9000000, "egresos": 6300000, "utilidad": 2700000}}}, {"unidad": "PROYECTOS", "linea": "Convocatorias", "referencia": "Publicas", "um": "Convocatoria", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 1, "precio": 30000000, "ingresos": 30000000, "egresos": 21000000, "utilidad": 9000000}, "Octubre": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"q": 0, "precio": 30000000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "PROYECTOS", "linea": "Convocatorias", "referencia": "Privadas", "um": "Convocatoria", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"q": 1, "precio": 50000000, "ingresos": 50000000, "egresos": 35000000, "utilidad": 15000000}, "Diciembre": {"q": 0, "precio": 50000000, "ingresos": 0, "egresos": 0, "utilidad": 0}}}, {"unidad": "DIGITAL", "linea": "Mision comparte", "referencia": "Manizales comparte", "um": "Membresias", "margen": 0.3, "meses": {"Julio": {"q": 0, "precio": 300000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"q": 0, "precio": 300000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"q": 0, "precio": 300000, "ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"q": 10, "precio": 300000, "ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Noviembre": {"q": 20, "precio": 300000, "ingresos": 6000000, "egresos": 4200000, "utilidad": 1800000}, "Diciembre": {"q": 30, "precio": 300000, "ingresos": 9000000, "egresos": 6300000, "utilidad": 2700000}}}], "subtotales": {"TURISMO": {"ingresos_total": 66810000, "egresos_total": 46767000, "utilidad_total": 20043000, "meses": {"Julio": {"ingresos": 9600000, "egresos": 6720000, "utilidad": 2880000}, "Agosto": {"ingresos": 8200000, "egresos": 5740000, "utilidad": 2460000}, "Septiembre": {"ingresos": 18200000, "egresos": 12740000, "utilidad": 5460000.0}, "Octubre": {"ingresos": 15700000, "egresos": 10990000, "utilidad": 4710000}, "Noviembre": {"ingresos": 10200000, "egresos": 7140000, "utilidad": 3060000}, "Diciembre": {"ingresos": 18500000, "egresos": 12950000, "utilidad": 5550000}}}, "EDUCACION": {"ingresos_total": 0, "egresos_total": 0, "utilidad_total": 0, "meses": {"Julio": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Diciembre": {"ingresos": 0, "egresos": 0, "utilidad": 0}}}, "MERCH": {"ingresos_total": 15240000, "egresos_total": 10668000, "utilidad_total": 4572000, "meses": {"Julio": {"ingresos": 4110000, "egresos": 2877000, "utilidad": 1233000}, "Agosto": {"ingresos": 850000, "egresos": 595000, "utilidad": 255000}, "Septiembre": {"ingresos": 1190000, "egresos": 833000, "utilidad": 357000}, "Octubre": {"ingresos": 2420000, "egresos": 1694000, "utilidad": 726000}, "Noviembre": {"ingresos": 2550000, "egresos": 1785000, "utilidad": 765000}, "Diciembre": {"ingresos": 4120000, "egresos": 2884000, "utilidad": 1236000}}}, "CORPORATIVA": {"ingresos_total": 240000000, "egresos_total": 168000000, "utilidad_total": 72000000, "meses": {"Julio": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"ingresos": 40000000, "egresos": 28000000, "utilidad": 12000000}, "Septiembre": {"ingresos": 10000000, "egresos": 7000000, "utilidad": 3000000}, "Octubre": {"ingresos": 60000000, "egresos": 42000000, "utilidad": 18000000}, "Noviembre": {"ingresos": 40000000, "egresos": 28000000, "utilidad": 12000000}, "Diciembre": {"ingresos": 90000000, "egresos": 63000000, "utilidad": 27000000}}}, "SOCIAL": {"ingresos_total": 30000000, "egresos_total": 21000000, "utilidad_total": 9000000, "meses": {"Julio": {"ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Agosto": {"ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Septiembre": {"ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Octubre": {"ingresos": 6000000, "egresos": 4200000, "utilidad": 1800000}, "Noviembre": {"ingresos": 6000000, "egresos": 4200000, "utilidad": 1800000}, "Diciembre": {"ingresos": 9000000, "egresos": 6300000, "utilidad": 2700000}}}, "PROYECTOS": {"ingresos_total": 165000000, "egresos_total": 56000000, "utilidad_total": 24000000, "meses": {"Julio": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"ingresos": 30000000, "egresos": 21000000, "utilidad": 9000000}, "Octubre": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Noviembre": {"ingresos": 50000000, "egresos": 35000000, "utilidad": 15000000}, "Diciembre": {"ingresos": 0, "egresos": 0, "utilidad": 0}}}, "DIGITAL": {"ingresos_total": 18000000, "egresos_total": 12600000, "utilidad_total": 5400000, "meses": {"Julio": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Agosto": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Septiembre": {"ingresos": 0, "egresos": 0, "utilidad": 0}, "Octubre": {"ingresos": 3000000, "egresos": 2100000, "utilidad": 900000}, "Noviembre": {"ingresos": 6000000, "egresos": 4200000, "utilidad": 1800000}, "Diciembre": {"ingresos": 9000000, "egresos": 6300000, "utilidad": 2700000}}}}, "gran_total_semestre": {"ingresos_total": 535050000, "egresos_total": 315035000, "utilidad_total": 135015000, "meses": {"Julio": {"ingresos": 16710000, "egresos": 11697000, "utilidad": 5013000}, "Agosto": {"ingresos": 52050000, "egresos": 36435000, "utilidad": 15615000}, "Septiembre": {"ingresos": 62390000, "egresos": 43673000, "utilidad": 18717000}, "Octubre": {"ingresos": 87120000, "egresos": 60984000, "utilidad": 26136000}, "Noviembre": {"ingresos": 114750000, "egresos": 80325000, "utilidad": 34425000}, "Diciembre": {"ingresos": 130620000, "egresos": 91434000, "utilidad": 39186000}}}, "anual": {"ingresos_2025": 495226530, "ingresos_1sem": 476706000, "presupuesto": 524990000, "egresos": 320493000, "utilidad": 204497000}, "meta_ventas_2026": 1001696000};

const MONTHS = ["Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTH_SHORT = { Julio: "Jul", Agosto: "Ago", Septiembre: "Sep", Octubre: "Oct", Noviembre: "Nov", Diciembre: "Dic" };

const UNIT_META = {
  TURISMO:     { label: "Turismo",     color: "#D9A441", glyph: "◆" },
  EDUCACION:   { label: "Educación",   color: "#4FA391", glyph: "▲" },
  MERCH:       { label: "Merch",       color: "#B5583A", glyph: "●" },
  CORPORATIVA: { label: "Corporativa", color: "#7C8FC9", glyph: "■" },
  SOCIAL:      { label: "Social",      color: "#C77DAE", glyph: "❖" },
  PROYECTOS:   { label: "Proyectos",   color: "#8FB84E", glyph: "▶" },
  DIGITAL:     { label: "Digital",     color: "#5FBEDB", glyph: "◈" },
};

const UNIT_ORDER = ["TURISMO", "EDUCACION", "MERCH", "CORPORATIVA", "SOCIAL", "PROYECTOS", "DIGITAL"];

// etiqueta de la unidad (Q tickets) según la unidad estratégica de negocio
const UNIT_TICKET_LABEL = {
  TURISMO: "tickets",
  EDUCACION: "tickets",
  MERCH: "unidades",
  CORPORATIVA: "paquete",
  SOCIAL: "patrocinio",
  PROYECTOS: "proyecto",
  DIGITAL: "membresia",
};

const fmtCOP = (n) => {
  const v = Math.round(n || 0);
  return "$" + v.toLocaleString("es-CO");
};
const fmtCOPShort = (n) => {
  const v = n || 0;
  if (Math.abs(v) >= 1e6) return "$" + (v / 1e6).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "M";
  if (Math.abs(v) >= 1e3) return "$" + (v / 1e3).toLocaleString("es-CO", { maximumFractionDigits: 0 }) + "K";
  return "$" + v.toLocaleString("es-CO");
};
const fmtPct = (n) => (n * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "%";

// deep clone helper
const clone = (o) => JSON.parse(JSON.stringify(o));

function NumberInput({ value, onChange, className, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(value == null ? "" : String(value));

  useEffect(() => {
    if (!focused) setRaw(value == null ? "" : String(value));
  }, [value, focused]);

  const display = focused ? raw : (value == null ? "" : String(value));

  return (
    <input
      type="number"
      min="0"
      className={className}
      placeholder={placeholder}
      value={display}
      onFocus={(e) => { setFocused(true); setRaw(value == null ? "" : String(value)); e.target.select(); }}
      onBlur={() => setFocused(false)}
      onChange={(e) => { setRaw(e.target.value); onChange(e.target.value); }}
    />
  );
}

function CurrencyInput({ value, onChange, className, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(value == null ? "" : String(value));

  useEffect(() => {
    if (!focused) setRaw(value == null ? "" : String(value));
  }, [value, focused]);

  const display = focused ? raw : (value == null ? "" : fmtCOP(value));

  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      placeholder={placeholder}
      value={display}
      onFocus={(e) => { setFocused(true); setRaw(value == null ? "" : String(value)); e.target.select(); }}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^\d]/g, "");
        setRaw(digits);
        onChange(digits);
      }}
    />
  );
}

function TopoLine() {
  return (
    <svg className="topo" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,90 C60,60 100,100 160,70 C220,40 260,90 320,60 C380,30 420,80 480,55 C540,30 580,75 640,50 C700,25 740,70 800,45 C860,20 900,65 960,42 C1020,20 1060,55 1120,35 C1160,22 1180,40 1200,30" />
      <path className="topo-2" d="M0,105 C70,85 110,110 170,90 C230,70 270,105 330,85 C390,65 430,100 490,80 C550,60 590,95 650,75 C710,55 750,90 810,70 C870,50 910,85 970,65 C1030,45 1070,72 1130,55 C1165,45 1185,58 1200,50" />
    </svg>
  );
}

export default function BudgetApp() {
  const [overrides, setOverrides] = useState({}); // key: `${idx}|${month}` -> qty presupuestado
  const [priceOverrides, setPriceOverrides] = useState({}); // key: `${idx}|${month}` -> precio editado
  const [real, setReal] = useState({}); // key: `${idx}|${month}` -> qty real vendida
  const [realIngresosOverride, setRealIngresosOverride] = useState({}); // key: `${idx}|${month}` -> ingresos reales (COP) directos
  const [unitReal, setUnitReal] = useState({}); // key: unidad -> ventas reales totales Jul-Dic (COP)
  const [unitSales, setUnitSales] = useState({}); // key: unidad -> [{id, fecha, valor, cliente, nota}]
  const [sales, setSales] = useState({}); // key: `${idx}|${month}` -> [{id, fecha, cantidad, cliente, nota}]
  const [kpis, setKpis] = useState({}); // key: unidad -> { prospectos, citas, visitas, propuestas, ventas }
  const [vendedores, setVendedores] = useState([]); // [{id, nombre, unidad, metas:{...}, avance:{...}}]
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("presupuesto"); // presupuesto | tablero
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeUnit, setActiveUnit] = useState("ALL");
  const [activeMonth, setActiveMonth] = useState(MONTHS[0]);
  const [ganttMetric, setGanttMetric] = useState("ingresos"); // ingresos | utilidad
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [toast, setToast] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // idx of row con venta-a-venta abierto
  const [expandedUnit, setExpandedUnit] = useState(null); // unidad con venta-a-venta abierta

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("presupuesto:state", false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setOverrides(parsed.overrides || {});
          setReal(parsed.real || {});
          setRealIngresosOverride(parsed.realIngresosOverride || {});
          setUnitReal(parsed.unitReal || {});
          setPriceOverrides(parsed.priceOverrides || {});
          setSales(parsed.sales || {});
          setUnitSales(parsed.unitSales || {});
          setKpis(parsed.kpis || {});
          setVendedores(parsed.vendedores || []);
        }
      } catch (e) {
        // no saved data yet
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistTimeoutRef = useRef(null);
  const persistSeqRef = useRef(0);
  const pendingPayloadRef = useRef(null);

  const flushPersist = useCallback(() => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = null;
    }
    const payload = pendingPayloadRef.current;
    if (!payload) return;
    pendingPayloadRef.current = null;
    try {
      window.storage.set("presupuesto:state", JSON.stringify(payload), false);
    } catch (e) {
      // ignorar: mejor esfuerzo al cerrar/refrescar
    }
  }, []);

  // guarda inmediatamente cualquier cambio pendiente si se refresca, cierra o cambia de pestaña
  useEffect(() => {
    window.addEventListener("beforeunload", flushPersist);
    document.addEventListener("visibilitychange", flushPersist);
    return () => {
      window.removeEventListener("beforeunload", flushPersist);
      document.removeEventListener("visibilitychange", flushPersist);
      flushPersist();
    };
  }, [flushPersist]);

  const persist = useCallback((patch = {}) => {
    setSaveState("saving");
    const payload = {
      overrides: patch.overrides !== undefined ? patch.overrides : overrides,
      real: patch.real !== undefined ? patch.real : real,
      realIngresosOverride: patch.realIngresosOverride !== undefined ? patch.realIngresosOverride : realIngresosOverride,
      unitReal: patch.unitReal !== undefined ? patch.unitReal : unitReal,
      priceOverrides: patch.priceOverrides !== undefined ? patch.priceOverrides : priceOverrides,
      sales: patch.sales !== undefined ? patch.sales : sales,
      unitSales: patch.unitSales !== undefined ? patch.unitSales : unitSales,
      kpis: patch.kpis !== undefined ? patch.kpis : kpis,
      vendedores: patch.vendedores !== undefined ? patch.vendedores : vendedores,
    };
    pendingPayloadRef.current = payload;
    // debounce: si llegan varios cambios seguidos (ej. escribiendo rápido), solo se guarda
    // el último, para que una escritura anterior no sobreescriba por llegar tarde al storage
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    const seq = ++persistSeqRef.current;
    persistTimeoutRef.current = setTimeout(() => {
      persistTimeoutRef.current = null;
      pendingPayloadRef.current = null;
      (async () => {
        try {
          await window.storage.set("presupuesto:state", JSON.stringify(payload), false);
          // si mientras se guardaba llegó un cambio más nuevo, no toques el estado de "guardado"
          if (seq === persistSeqRef.current) {
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 1200);
          }
        } catch (e) {
          setSaveState("idle");
        }
      })();
    }, 450);
  }, [overrides, real, realIngresosOverride, unitReal, priceOverrides, sales, unitSales, kpis, vendedores]);

  const setQty = (idx, month, value) => {
    const q = Math.max(0, Math.round(Number(value) || 0));
    setOverrides((prev) => {
      const next = { ...prev, [`${idx}|${month}`]: q };
      persist({ overrides: next });
      return next;
    });
  };

  // distribuye el TOTAL ingresado entre los 6 meses lo más parejo posible (usado desde "Jul–Dic")
  const setPrice = (idx, month, value) => {
    const key = `${idx}|${month}`;
    setPriceOverrides((prev) => {
      const next = { ...prev };
      if (value === "") delete next[key];
      else next[key] = Math.max(0, Number(value) || 0);
      persist({ priceOverrides: next });
      return next;
    });
  };

  // aplica el mismo precio a los 6 meses (usado desde la pestaña "Jul–Dic")
  const setPriceAllMonths = (idx, value) => {
    setPriceOverrides((prev) => {
      const next = { ...prev };
      const v = value === "" ? undefined : Math.max(0, Number(value) || 0);
      MONTHS.forEach((m) => {
        const key = `${idx}|${m}`;
        if (v === undefined) delete next[key]; else next[key] = v;
      });
      persist({ priceOverrides: next });
      return next;
    });
  };

  const setRealQty = (idx, month, value) => {
    const raw = value === "" ? undefined : Math.max(0, Math.round(Number(value) || 0));
    setReal((prev) => {
      const next = { ...prev };
      if (raw === undefined) delete next[`${idx}|${month}`];
      else next[`${idx}|${month}`] = raw;
      persist({ real: next });
      return next;
    });
    // al registrar por cantidad, el valor directo de ingresos reales deja de ser la fuente
    if (raw !== undefined) {
      const key = `${idx}|${month}`;
      setRealIngresosOverride((prev) => {
        if (prev[key] === undefined) return prev;
        const next = { ...prev };
        delete next[key];
        persist({ realIngresosOverride: next });
        return next;
      });
    }
  };

  const setRealIngresos = (idx, month, value) => {
    const key = `${idx}|${month}`;
    const raw = value === "" ? undefined : Math.max(0, Math.round(Number(value) || 0));
    setRealIngresosOverride((prev) => {
      const next = { ...prev };
      if (raw === undefined) delete next[key];
      else next[key] = raw;
      persist({ realIngresosOverride: next });
      return next;
    });
    // al registrar el valor directamente, la cantidad manual deja de ser la fuente
    if (raw !== undefined) {
      setReal((prev) => {
        if (prev[key] === undefined) return prev;
        const next = { ...prev };
        delete next[key];
        persist({ real: next });
        return next;
      });
    }
  };

  // --- Venta a venta: registro individual de cada venta por unidad estratégica ---
  const addUnitSale = (unit, entry) => {
    setUnitSales((prev) => {
      const list = prev[unit] ? [...prev[unit]] : [];
      list.push({
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fecha: entry.fecha || "",
        valor: Math.max(0, Math.round(Number(entry.valor) || 0)),
        cliente: entry.cliente || "",
        rentaPct: entry.rentaPct === "" || entry.rentaPct == null ? null : Math.min(100, Math.max(0, Number(entry.rentaPct))),
      });
      const next = { ...prev, [unit]: list };
      const sumV = list.reduce((a, s) => a + s.valor, 0);
      setUnitReal((prevUR) => {
        const nextUR = { ...prevUR, [unit]: sumV };
        persist({ unitReal: nextUR, unitSales: next });
        return nextUR;
      });
      return next;
    });
  };

  const removeUnitSale = (unit, saleId) => {
    setUnitSales((prev) => {
      const list = (prev[unit] || []).filter((s) => s.id !== saleId);
      const next = { ...prev };
      if (list.length) next[unit] = list;
      else delete next[unit];
      const sumV = list.reduce((a, s) => a + s.valor, 0);
      setUnitReal((prevUR) => {
        const nextUR = { ...prevUR };
        if (list.length) nextUR[unit] = sumV;
        else delete nextUR[unit];
        persist({ unitReal: nextUR, unitSales: next });
        return nextUR;
      });
      return next;
    });
  };

  // --- Venta a venta: registro individual de cada venta de una línea/mes ---
  // precio != null: se registra cantidad (el valor se calcula cantidad × precio)
  // precio == null: se registra el valor (ingresos) directamente, p. ej. patrocinios sin precio unitario
  const effectivePrecio = (idx, month) => {
    const key = `${idx}|${month}`;
    if (priceOverrides[key] !== undefined) return priceOverrides[key];
    const raw = RAW_DATA.items[idx];
    return raw ? raw.meses[month].precio : null;
  };

  const saleValor = (s, precioFallback) =>
    s.valor != null ? s.valor : (s.cantidad && precioFallback != null ? s.cantidad * precioFallback : 0);

  const addSale = (idx, month, entry, precio) => {
    const key = `${idx}|${month}`;
    const precioFallback = effectivePrecio(idx, month);
    setSales((prev) => {
      const list = prev[key] ? [...prev[key]] : [];
      const hasCantidad = entry.cantidad !== undefined && entry.cantidad !== "";
      const hasValor = entry.valor !== undefined && entry.valor !== "";
      const cantidad = hasCantidad ? Math.max(0, Math.round(Number(entry.cantidad) || 0)) : 0;
      let valor;
      if (hasValor) {
        valor = Math.max(0, Math.round(Number(entry.valor) || 0));
      } else if (precio != null && hasCantidad) {
        valor = cantidad * precio;
      } else {
        valor = 0;
      }
      list.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fecha: entry.fecha || "",
        cantidad,
        valor,
        cliente: entry.cliente || "",
        nota: entry.nota || "",
        rentaPct: entry.rentaPct === "" || entry.rentaPct == null ? null : Math.min(100, Math.max(0, Number(entry.rentaPct))),
      });
      const next = { ...prev, [key]: list };
      const sumQ = list.reduce((a, s) => a + (s.cantidad || 0), 0);
      const sumValor = list.reduce((a, s) => a + saleValor(s, precioFallback), 0);
      setReal((prevReal) => {
        const nextReal = { ...prevReal };
        if (sumQ > 0) nextReal[key] = sumQ; else delete nextReal[key];
        setRealIngresosOverride((prevRIO) => {
          const nextRIO = { ...prevRIO, [key]: sumValor };
          persist({ real: nextReal, realIngresosOverride: nextRIO, sales: next });
          return nextRIO;
        });
        return nextReal;
      });
      return next;
    });
  };

  const removeSale = (idx, month, saleId) => {
    const key = `${idx}|${month}`;
    const precioFallback = effectivePrecio(idx, month);
    setSales((prev) => {
      const list = (prev[key] || []).filter((s) => s.id !== saleId);
      const next = { ...prev };
      if (list.length) next[key] = list;
      else delete next[key];
      const sumQ = list.reduce((a, s) => a + (s.cantidad || 0), 0);
      const sumValor = list.reduce((a, s) => a + saleValor(s, precioFallback), 0);
      setReal((prevReal) => {
        const nextReal = { ...prevReal };
        if (sumQ > 0) nextReal[key] = sumQ; else delete nextReal[key];
        setRealIngresosOverride((prevRIO) => {
          const nextRIO = { ...prevRIO };
          if (list.length) nextRIO[key] = sumValor; else delete nextRIO[key];
          persist({ real: nextReal, realIngresosOverride: nextRIO, sales: next });
          return nextRIO;
        });
        return nextReal;
      });
      return next;
    });
  };


  // registrar/eliminar una venta desde "Ventas reales por unidad estratégica" anexándola a una línea/referencia:
  // reutiliza el mismo registro venta a venta del detalle por línea (valor directo en COP)
  const addLinkedSale = (idx, mes, entry) => addSale(idx, mes, entry, null);
  const removeLinkedSale = (idx, mes, saleId) => removeSale(idx, mes, saleId);

  // elimina por completo el registro de venta real (cantidad, ingresos y log venta a venta) de una línea/mes
  const clearRealForCell = (idx, month) => {
    const key = `${idx}|${month}`;
    const nextSales = { ...sales };
    delete nextSales[key];
    const nextReal = { ...real };
    delete nextReal[key];
    const nextRIO = { ...realIngresosOverride };
    delete nextRIO[key];
    setSales(nextSales);
    setReal(nextReal);
    setRealIngresosOverride(nextRIO);
    persist({ sales: nextSales, real: nextReal, realIngresosOverride: nextRIO });
  };

  // --- KPIs de tablero de control por unidad estratégica ---
  const setKpiValue = (unit, field, value) => {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setKpis((prev) => {
      const next = { ...prev, [unit]: { ...(prev[unit] || {}), [field]: v } };
      persist({ kpis: next });
      return next;
    });
  };

  const resetKpis = () => {
    setKpis({});
    persist({ kpis: {} });
    setToast("Tablero de control reiniciado");
    setTimeout(() => setToast(null), 2200);
  };

  // --- Vendedores: metas por indicador y avance individual ---
  const addVendedor = (nombre, unidad) => {
    const nuevo = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nombre: nombre.trim() || "Sin nombre",
      unidad: unidad || "ALL",
      metas: { prospectos: 0, citas: 0, visitas: 0, propuestas: 0, ventas: 0 },
      avance: { prospectos: 0, citas: 0, visitas: 0, propuestas: 0, ventas: 0 },
    };
    setVendedores((prev) => {
      const next = [...prev, nuevo];
      persist({ vendedores: next });
      return next;
    });
  };

  const removeVendedor = (id) => {
    setVendedores((prev) => {
      const next = prev.filter((v) => v.id !== id);
      persist({ vendedores: next });
      return next;
    });
  };

  const setVendedorMeta = (id, field, value) => {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setVendedores((prev) => {
      const next = prev.map((vd) => (vd.id === id ? { ...vd, metas: { ...vd.metas, [field]: v } } : vd));
      persist({ vendedores: next });
      return next;
    });
  };

  const setVendedorAvance = (id, field, value) => {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setVendedores((prev) => {
      const next = prev.map((vd) => (vd.id === id ? { ...vd, avance: { ...vd.avance, [field]: v } } : vd));
      persist({ vendedores: next });
      return next;
    });
  };

  const setVendedorUnidad = (id, unidad) => {
    setVendedores((prev) => {
      const next = prev.map((vd) => (vd.id === id ? { ...vd, unidad } : vd));
      persist({ vendedores: next });
      return next;
    });
  };

  const resetAll = () => {
    setOverrides({});
    persist({ overrides: {} });
    setToast("Cantidades restauradas al presupuesto original");
    setTimeout(() => setToast(null), 2200);
  };

  const resetReal = () => {
    setReal({});
    setRealIngresosOverride({});
    setUnitReal({});
    setSales({});
    setUnitSales({});
    persist({ real: {}, realIngresosOverride: {}, unitReal: {}, sales: {}, unitSales: {} });
    setToast("Registro de ventas reales borrado");
    setTimeout(() => setToast(null), 2200);
  };

  // build working items with overrides + real sales applied
  const items = useMemo(() => {
    return RAW_DATA.items.map((raw, idx) => {
      const item = clone(raw);
      let ingresos_total = 0, egresos_total = 0, utilidad_total = 0;
      let real_ingresos_total = 0, real_egresos_total = 0, real_utilidad_total = 0, real_registrado = false;
      MONTHS.forEach((m) => {
        const key = `${idx}|${m}`;
        const cell = item.meses[m];
        const qOverride = overrides[key];
        const priceOverride = priceOverrides[key];
        const effQ = qOverride !== undefined ? qOverride : cell.q;
        const effPrecio = priceOverride !== undefined ? priceOverride : cell.precio;
        if (qOverride !== undefined || priceOverride !== undefined) {
          let ingresos = cell.ingresos, egresos = cell.egresos, utilidad = cell.utilidad;
          if (effPrecio != null) {
            ingresos = effQ * effPrecio;
            egresos = Math.round(ingresos * (1 - item.margen));
            utilidad = ingresos - egresos;
          }
          item.meses[m] = {
            ...cell,
            q: effQ,
            precio: effPrecio,
            ingresos,
            egresos,
            utilidad,
            edited: effQ !== cell.q || effPrecio !== cell.precio,
          };
        }
        // real sales for this cell: valor directo de ingresos tiene prioridad sobre cantidad × precio
        const realQ = real[key];
        const realIngresosOv = realIngresosOverride[key];
        let realIngresos = 0, realEgresos = 0, realUtilidad = 0, hasReal = false;
        if (realIngresosOv !== undefined) {
          hasReal = true;
          realIngresos = realIngresosOv;
        } else if (realQ !== undefined && item.meses[m].precio != null) {
          hasReal = true;
          realIngresos = realQ * item.meses[m].precio;
        }
        if (hasReal) {
          realEgresos = Math.round(realIngresos * (1 - item.margen));
          realUtilidad = realIngresos - realEgresos;
        }
        item.meses[m] = { ...item.meses[m], real_q: realQ, real_ingresos: realIngresos, real_egresos: realEgresos, real_utilidad: realUtilidad, has_real: hasReal };
        ingresos_total += item.meses[m].ingresos || 0;
        egresos_total += item.meses[m].egresos || 0;
        utilidad_total += item.meses[m].utilidad || 0;
        if (hasReal) {
          real_registrado = true;
          real_ingresos_total += realIngresos;
          real_egresos_total += realEgresos;
          real_utilidad_total += realUtilidad;
        }
      });
      item.ingresos_total = ingresos_total;
      item.egresos_total = egresos_total;
      item.utilidad_total = utilidad_total;
      item.real_ingresos_total = real_ingresos_total;
      item.real_egresos_total = real_egresos_total;
      item.real_utilidad_total = real_utilidad_total;
      item.real_registrado = real_registrado;
      item.idx = idx;
      return item;
    });
  }, [overrides, priceOverrides, real, realIngresosOverride]);

  const hasEdits = Object.keys(overrides).length > 0;
  const hasReal = Object.keys(real).length > 0;

  const filteredItems = useMemo(
    () => (activeUnit === "ALL" ? items : items.filter((i) => i.unidad === activeUnit)),
    [items, activeUnit]
  );

  const totals = useMemo(() => {
    const acc = { ingresos: 0, egresos: 0, utilidad: 0, realIngresos: 0, realEgresos: 0, realUtilidad: 0, anyReal: false };
    filteredItems.forEach((i) => {
      if (activeMonth === "TOTAL") {
        acc.ingresos += i.ingresos_total;
        acc.egresos += i.egresos_total;
        acc.utilidad += i.utilidad_total;
        acc.realIngresos += i.real_ingresos_total;
        acc.realEgresos += i.real_egresos_total;
        acc.realUtilidad += i.real_utilidad_total;
        if (i.real_registrado) acc.anyReal = true;
      } else {
        const cell = i.meses[activeMonth];
        acc.ingresos += cell.ingresos || 0;
        acc.egresos += cell.egresos || 0;
        acc.utilidad += cell.utilidad || 0;
        if (cell.has_real) {
          acc.realIngresos += cell.real_ingresos || 0;
          acc.realEgresos += cell.real_egresos || 0;
          acc.realUtilidad += cell.real_utilidad || 0;
          acc.anyReal = true;
        }
      }
    });
    return acc;
  }, [filteredItems, activeMonth]);

  const monthlyChartData = useMemo(() => {
    return MONTHS.map((m) => {
      let ingresos = 0, egresos = 0, utilidad = 0, realIngresos = 0, anyReal = false;
      filteredItems.forEach((i) => {
        ingresos += i.meses[m].ingresos || 0;
        egresos += i.meses[m].egresos || 0;
        utilidad += i.meses[m].utilidad || 0;
        if (i.meses[m].has_real) { anyReal = true; realIngresos += i.meses[m].real_ingresos || 0; }
      });
      return { mes: MONTH_SHORT[m], mesFull: m, Ingresos: ingresos, Egresos: egresos, Utilidad: utilidad, Real: anyReal ? realIngresos : null };
    });
  }, [filteredItems]);

  // real vs presupuesto comparables (only over cells where real sales were registered)
  const ganttData = useMemo(() => {
    return MONTHS.map((m) => {
      let presupuesto = 0, realVal = 0, anyReal = false;
      filteredItems.forEach((i) => {
        const cell = i.meses[m];
        const pVal = ganttMetric === "ingresos" ? cell.ingresos : cell.utilidad;
        presupuesto += pVal || 0;
        if (cell.has_real) {
          anyReal = true;
          realVal += (ganttMetric === "ingresos" ? cell.real_ingresos : cell.real_utilidad) || 0;
        }
      });
      return { key: m, label: m, presupuesto, real: realVal, anyReal };
    });
  }, [filteredItems, ganttMetric]);

  // datos de toda la compañía (sin filtro de unidad activa), para la presentación ejecutiva
  const companyMonthly = useMemo(() => {
    return MONTHS.map((m) => {
      let ingresosP = 0, ingresosR = 0, utilidadP = 0, utilidadR = 0, anyReal = false;
      items.forEach((i) => {
        const cell = i.meses[m];
        ingresosP += cell.ingresos || 0;
        utilidadP += cell.utilidad || 0;
        if (cell.has_real) {
          anyReal = true;
          ingresosR += cell.real_ingresos || 0;
          utilidadR += cell.real_utilidad || 0;
        }
      });
      return { key: m, label: m, ingresosP, ingresosR, utilidadP, utilidadR, anyReal };
    });
  }, [items]);

  const companyTotals = useMemo(() => {
    let presupuesto = 0, real = 0, presupuestoUtilidad = 0, realUtilidad = 0, anyReal = false;
    items.forEach((i) => {
      presupuesto += i.ingresos_total;
      presupuestoUtilidad += i.utilidad_total;
      if (i.real_registrado) {
        anyReal = true;
        real += i.real_ingresos_total;
        realUtilidad += i.real_utilidad_total;
      }
    });
    return {
      presupuesto, real, presupuestoUtilidad, realUtilidad, anyReal,
      pct: presupuesto > 0 ? real / presupuesto : null,
    };
  }, [items]);

  // presupuesto de ingresos Jul-Dic por unidad (sin filtrar por activeUnit)
  const unitBudgetTotals = useMemo(() => {
    const map = {};
    UNIT_ORDER.forEach((u) => (map[u] = 0));
    items.forEach((i) => { map[i.unidad] = (map[i.unidad] || 0) + i.ingresos_total; });
    return map;
  }, [items]);

  // ventas reales agregadas desde el detalle por línea, por unidad
  const unitItemRealTotals = useMemo(() => {
    const sum = {}, any = {};
    UNIT_ORDER.forEach((u) => { sum[u] = 0; any[u] = false; });
    items.forEach((i) => {
      if (i.real_registrado) { sum[i.unidad] += i.real_ingresos_total; any[i.unidad] = true; }
    });
    return { sum, any };
  }, [items]);

  // valor efectivo por unidad: se suma lo registrado sin línea específica (genérico)
  // más lo registrado línea por línea en el detalle (incluye lo anexado desde esta misma sección)
  const unitCompareData = useMemo(() => {
    // egresos/utilidad reales a partir del % de renta registrado en cada venta (si se diligenció)
    const rentaAgg = {};
    UNIT_ORDER.forEach((u) => { rentaAgg[u] = { egresos: 0, utilidad: 0, any: false }; });
    const applyRenta = (unit, s) => {
      if (s.rentaPct == null || !rentaAgg[unit]) return;
      const ut = Math.round(s.valor * (s.rentaPct / 100));
      rentaAgg[unit].utilidad += ut;
      rentaAgg[unit].egresos += (s.valor - ut);
      rentaAgg[unit].any = true;
    };
    Object.entries(unitSales).forEach(([u, list]) => (list || []).forEach((s) => applyRenta(u, s)));
    items.forEach((item) => {
      MONTHS.forEach((m) => {
        const list = sales[`${item.idx}|${m}`];
        if (list) list.forEach((s) => applyRenta(item.unidad, s));
      });
    });

    return UNIT_ORDER.map((u) => {
      const presupuesto = unitBudgetTotals[u] || 0;
      const generico = unitReal[u] || 0;
      const detalle = unitItemRealTotals.sum[u] || 0;
      const fromDetail = unitItemRealTotals.any[u];
      const anyReal = unitReal[u] !== undefined || fromDetail;
      const real = generico + detalle;
      let source = null;
      if (unitReal[u] !== undefined && fromDetail) source = "mixto";
      else if (unitReal[u] !== undefined) source = "manual";
      else if (fromDetail) source = "detalle";
      const renta = rentaAgg[u];
      return {
        key: u, label: UNIT_META[u].label, presupuesto, real: real || 0, anyReal,
        generico, detalle, source,
        realEgresos: renta.any ? renta.egresos : null,
        realUtilidad: renta.any ? renta.utilidad : null,
      };
    });
  }, [unitBudgetTotals, unitReal, unitItemRealTotals, unitSales, sales, items]);

  // líneas/referencias disponibles por unidad, para anexarlas al registrar una venta
  const unitLineOptions = useMemo(() => {
    const map = {};
    UNIT_ORDER.forEach((u) => { map[u] = []; });
    items.forEach((i) => { map[i.unidad].push({ idx: i.idx, label: i.referencia, linea: i.linea }); });
    return map;
  }, [items]);

  // registro combinado (genérico + por línea) para mostrar en "Ventas reales por unidad estratégica"
  const unitSalesCombined = useMemo(() => {
    const map = {};
    UNIT_ORDER.forEach((u) => { map[u] = []; });
    Object.entries(unitSales).forEach(([u, list]) => {
      (list || []).forEach((s) => {
        if (map[u]) map[u].push({ ...s, tipo: "generic", combinedKey: `g-${s.id}` });
      });
    });
    items.forEach((item) => {
      MONTHS.forEach((m) => {
        const list = sales[`${item.idx}|${m}`];
        if (list && list.length) {
          list.forEach((s) => {
            map[item.unidad].push({
              ...s,
              tipo: "linea",
              idx: item.idx,
              mes: m,
              referencia: item.referencia,
              combinedKey: `l-${s.id}`,
            });
          });
        }
      });
    });
    UNIT_ORDER.forEach((u) => {
      map[u].sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
    });
    return map;
  }, [unitSales, sales, items]);

  const cumplimiento = useMemo(() => {
    const rows = activeUnit === "ALL" ? unitCompareData : unitCompareData.filter((d) => d.key === activeUnit);
    let realSum = 0, presSum = 0;
    rows.forEach((d) => { if (d.anyReal) { realSum += d.real; presSum += d.presupuesto; } });
    return { realSum, presSum, pct: presSum > 0 ? realSum / presSum : null };
  }, [unitCompareData, activeUnit]);

  const unitPieData = useMemo(() => {
    return UNIT_ORDER.map((u) => {
      const sum = items.filter((i) => i.unidad === u).reduce((a, i) => a + i.ingresos_total, 0);
      return { name: UNIT_META[u].label, value: sum, unit: u };
    }).filter((d) => d.value > 0);
  }, [items]);

  // --- Datos del tablero de control (embudo comercial por unidad estratégica) ---
  const FUNNEL_STAGES = [
    { key: "prospectos", label: "Identificación de prospectos", short: "Prospectos" },
    { key: "citas", label: "Citas alcanzadas", short: "Citas" },
    { key: "visitas", label: "Visitas realizadas", short: "Visitas" },
    { key: "propuestas", label: "Propuestas enviadas", short: "Propuestas" },
    { key: "ventas", label: "Ventas cerradas", short: "Ventas" },
  ];

  const funnelData = useMemo(() => {
    return UNIT_ORDER.map((u) => {
      const k = kpis[u] || {};
      const vals = FUNNEL_STAGES.map((s) => k[s.key] || 0);
      return { unit: u, label: UNIT_META[u].label, color: UNIT_META[u].color, vals };
    });
  }, [kpis]);

  const funnelTotals = useMemo(() => {
    return FUNNEL_STAGES.map((s, i) => funnelData.reduce((a, d) => a + d.vals[i], 0));
  }, [funnelData]);

  const funnelAnyData = funnelTotals.some((v) => v > 0);

  const metaAnual = RAW_DATA.meta_ventas_2026;
  const presupuestoAnual = RAW_DATA.anual.presupuesto;
  const avanceSemestre = presupuestoAnual ? totals_all_ingresos(items) / presupuestoAnual : 0;

  function totals_all_ingresos(list) {
    return list.reduce((a, i) => a + i.ingresos_total, 0);
  }

  const grandIngresos = useMemo(() => items.reduce((a, i) => a + i.ingresos_total, 0), [items]);
  const grandEgresos = useMemo(() => items.reduce((a, i) => a + i.egresos_total, 0), [items]);
  const grandUtilidad = useMemo(() => items.reduce((a, i) => a + i.utilidad_total, 0), [items]);
  const avancePct = presupuestoAnual ? grandIngresos / presupuestoAnual : 0;

  if (!loaded) {
    return (
      <div className="app-root loading-root">
        <div className="loading-mark">MC</div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <style>{CSS}</style>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">MC</div>
          <div className="brand-text">
            <div className="brand-title">Manizales Comparte</div>
            <div className="brand-sub">Presupuesto 2026 · Jul–Dic</div>
          </div>
        </div>

        <button
          className={"dashboard-btn" + (view === "tablero" ? " active" : "")}
          onClick={() => setView(view === "tablero" ? "presupuesto" : "tablero")}
        >
          <span className="dashboard-btn-icon">◫</span>
          {view === "tablero" ? "← Volver al presupuesto" : "Tablero de control"}
        </button>

        <nav className="unit-nav">
          <button
            className={"unit-btn" + (activeUnit === "ALL" && view === "presupuesto" ? " active" : "")}
            onClick={() => { setView("presupuesto"); setActiveUnit("ALL"); }}
          >
            <span className="unit-dot all-dot" />
            Todas las unidades
          </button>
          {UNIT_ORDER.map((u) => {
            const meta = UNIT_META[u];
            const sum = items.filter((i) => i.unidad === u).reduce((a, i) => a + i.ingresos_total, 0);
            return (
              <button
                key={u}
                className={"unit-btn" + (activeUnit === u && view === "presupuesto" ? " active" : "")}
                onClick={() => { setView("presupuesto"); setActiveUnit(u); }}
                style={activeUnit === u ? { borderColor: meta.color } : undefined}
              >
                <span className="unit-dot" style={{ background: meta.color }} />
                <span className="unit-btn-label">{meta.label}</span>
                <span className="unit-btn-value">{fmtCOPShort(sum)}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="reset-btn" onClick={resetAll} disabled={!hasEdits}>
            ↺ Restaurar cifras originales
          </button>
          <div className={"save-indicator " + saveState}>
            {saveState === "saving" && "Guardando…"}
            {saveState === "saved" && "✓ Guardado"}
            {saveState === "idle" && hasEdits && "Cambios guardados localmente"}
            {saveState === "idle" && !hasEdits && "Datos del archivo original"}
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="page-header">
          <div className="topo-wrap"><TopoLine /></div>
          <div className="header-content">
            {view === "presupuesto" ? (
              <>
                <p className="eyebrow">Segundo semestre · Julio a diciembre 2026</p>
                <h1>Presupuesto de ventas</h1>
                <p className="header-desc">
                  Cada cifra de esta cordillera es una decisión: cuántos tickets, membresías o
                  paquetes se venden cada mes. Ajusta la cantidad (Q) de cualquier línea y observa
                  cómo se recalculan ingresos, egresos y utilidad al instante.
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow">Gestión comercial · Embudo por unidad estratégica</p>
                <div className="tablero-title-row">
                  <h1>Tablero de control</h1>
                  <button className="presentation-btn" onClick={() => { setSlideIndex(0); setPresentationOpen(true); }}>
                    🖥️ Presentación
                  </button>
                </div>
                <p className="header-desc">
                  Registra prospectos, citas, visitas, propuestas y ventas cerradas de cada unidad
                  estratégica. La caja de seguimiento calcula automáticamente las tasas de
                  conversión entre etapas.
                </p>
              </>
            )}
          </div>
        </header>

        {view === "tablero" ? (
          <ControlDashboard
            funnelData={funnelData}
            funnelTotals={funnelTotals}
            funnelAnyData={funnelAnyData}
            stages={FUNNEL_STAGES}
            unitMeta={UNIT_META}
            unitOrder={UNIT_ORDER}
            onKpiChange={setKpiValue}
            kpis={kpis}
            onReset={resetKpis}
            vendedores={vendedores}
            onAddVendedor={addVendedor}
            onRemoveVendedor={removeVendedor}
            onVendedorMeta={setVendedorMeta}
            onVendedorAvance={setVendedorAvance}
            onVendedorUnidad={setVendedorUnidad}
            unitCompareData={unitCompareData}
            onUnitClick={(u) => { setView("presupuesto"); setActiveUnit(activeUnit === u ? "ALL" : u); }}
            ganttData={ganttData}
            ganttMetric={ganttMetric}
            onGanttMetricChange={setGanttMetric}
            hasReal={hasReal}
            activeUnit={activeUnit}
          />
        ) : (
        <>
        <section className="kpi-row">
          <div className="kpi-card">
            <span className="kpi-label">Ingresos · Jul–Dic</span>
            <span className="kpi-value">{fmtCOP(grandIngresos)}</span>
            <span className="kpi-note gold">Meta de ventas 2026: {fmtCOPShort(metaAnual)}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Egresos · Jul–Dic</span>
            <span className="kpi-value">{fmtCOP(grandEgresos)}</span>
            <span className="kpi-note clay">{fmtPct(grandEgresos / (grandIngresos || 1))} de los ingresos</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Utilidad bruta · Jul–Dic</span>
            <span className="kpi-value">{fmtCOP(grandUtilidad)}</span>
            <span className="kpi-note teal">Margen {fmtPct(grandUtilidad / (grandIngresos || 1))}</span>
          </div>
          <div className="kpi-card progress-card">
            <span className="kpi-label">Avance vs. presupuesto anual</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(100, avancePct * 100)}%` }} />
            </div>
            <span className="kpi-note">{fmtPct(avancePct)} de {fmtCOPShort(presupuestoAnual)}</span>
          </div>
          <div className="kpi-card progress-card">
            <span className="kpi-label">Cumplimiento ventas reales</span>
            {cumplimiento.pct != null ? (
              <>
                <div className="progress-track">
                  <div
                    className="progress-fill real-fill"
                    style={{ width: `${Math.min(100, cumplimiento.pct * 100)}%` }}
                  />
                </div>
                <span className="kpi-note">{fmtPct(cumplimiento.pct)} · {fmtCOPShort(cumplimiento.realSum)} de {fmtCOPShort(cumplimiento.presSum)} registrado</span>
              </>
            ) : (
              <span className="kpi-note muted">Aún no registras ventas reales</span>
            )}
          </div>
        </section>

        <section className="chart-grid">
          <div className="panel chart-panel">
            <div className="panel-head">
              <h2>Evolución mensual{activeUnit !== "ALL" ? ` — ${UNIT_META[activeUnit].label}` : ""}</h2>
              <p>Ingresos, egresos y utilidad bruta por mes</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D9A441" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#D9A441" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B5583A" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#B5583A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2A3E32" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="mes" stroke="#8FA398" tick={{ fontFamily: "IBM Plex Mono", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#8FA398" tick={{ fontFamily: "IBM Plex Mono", fontSize: 11 }} tickFormatter={fmtCOPShort} axisLine={false} tickLine={false} width={54} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Ingresos" stroke="#D9A441" fill="url(#gIngresos)" strokeWidth={2} />
                <Area type="monotone" dataKey="Egresos" stroke="#B5583A" fill="url(#gEgresos)" strokeWidth={2} />
                <Area type="monotone" dataKey="Utilidad" stroke="#4FA391" fill="transparent" strokeWidth={2.5} strokeDasharray="0" />
                <Area type="monotone" dataKey="Real" stroke="#F2EDE1" fill="transparent" strokeWidth={2} strokeDasharray="4 3" connectNulls dot={{ r: 3, fill: "#F2EDE1", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="legend-row">
              <span><i style={{ background: "#D9A441" }} />Ingresos</span>
              <span><i style={{ background: "#B5583A" }} />Egresos</span>
              <span><i style={{ background: "#4FA391" }} />Utilidad bruta</span>
              <span><i className="dashed" />Ventas reales</span>
            </div>
          </div>

          <div className="panel pie-panel">
            <div className="panel-head">
              <h2>Ingresos por unidad</h2>
              <p>Distribución Jul–Dic</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={unitPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                  onClick={(d) => setActiveUnit(d.unit)}
                  cursor="pointer"
                >
                  {unitPieData.map((d) => (
                    <Cell key={d.unit} fill={UNIT_META[d.unit].color} opacity={activeUnit === "ALL" || activeUnit === d.unit ? 1 : 0.35} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip total={grandIngresos} />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="pie-legend">
              {unitPieData.map((d) => (
                <li key={d.unit} onClick={() => setActiveUnit(d.unit)} className={activeUnit === d.unit ? "active" : ""}>
                  <i style={{ background: UNIT_META[d.unit].color }} />
                  <span>{d.name}</span>
                  <b>{fmtPct(d.value / (grandIngresos || 1))}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel unit-real-panel">
          <div className="panel-head">
            <h2>Ventas reales por unidad estratégica</h2>
            <p>Registra cada venta de forma independiente: se acumula automáticamente y se refleja en el gráfico de abajo</p>
          </div>

          <div className="unit-cards-grid">
            {unitCompareData.map((d) => {
              const pct = d.presupuesto > 0 ? d.real / d.presupuesto : null;
              const over = d.anyReal && pct != null && pct >= 1;
              const log = unitSalesCombined[d.key] || [];
              const isOpen = expandedUnit === d.key;
              return (
                <div
                  key={d.key}
                  className={"unit-card" + (activeUnit === d.key ? " active" : "")}
                  style={{ borderColor: activeUnit === d.key ? UNIT_META[d.key].color : undefined }}
                >
                  <div className="unit-card-head" onClick={() => setActiveUnit(activeUnit === d.key ? "ALL" : d.key)}>
                    <span className="unit-dot" style={{ background: UNIT_META[d.key].color }} />
                    <span className="unit-card-title">{d.label}</span>
                  </div>
                  <div className="unit-card-budget">Presupuesto: <b>{fmtCOP(d.presupuesto)}</b></div>
                  <div className="unit-card-real-total">
                    Ventas reales registradas
                    <b>{d.anyReal ? fmtCOP(d.real) : "Sin registrar"}</b>
                  </div>
                  {d.realEgresos != null && (
                    <div className="unit-card-renta-row">
                      <span>Egresos reales <b>{fmtCOP(d.realEgresos)}</b></span>
                      <span>Utilidad real <b className="accent">{fmtCOP(d.realUtilidad)}</b></span>
                    </div>
                  )}
                  <button
                    className={"unit-log-toggle" + (isOpen ? " open" : "") + (log.length ? " has-log" : "")}
                    onClick={(e) => { e.stopPropagation(); setExpandedUnit(isOpen ? null : d.key); }}
                  >
                    {isOpen ? "▾ Ocultar ventas" : `▸ Registrar / ver ventas${log.length ? ` (${log.length})` : ""}`}
                  </button>
                  {isOpen && (
                    <UnitSaleLog
                      entries={log}
                      lineOptions={unitLineOptions[d.key] || []}
                      unit={d.key}
                      onAddLinea={(idx, mes, entry) => addLinkedSale(idx, mes, entry)}
                      onRemove={(entry) =>
                        entry.tipo === "linea"
                          ? removeLinkedSale(entry.idx, entry.mes, entry.id)
                          : removeUnitSale(d.key, entry.id)
                      }
                    />
                  )}
                  <div className="unit-card-foot">
                    {pct != null ? (
                      <span className={over ? "var-pos" : "var-neg"}>
                        {over ? "✓ " : ""}{fmtPct(pct)} cumplido
                      </span>
                    ) : (
                      <span className="muted">Sin ventas registradas</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {(Object.keys(unitReal).length > 0 || hasReal) && (
            <div className="sidebar-footer gantt-reset">
              <button className="reset-btn" onClick={resetReal}>
                ↺ Borrar ventas reales registradas
              </button>
            </div>
          )}
        </section>

        <section className="panel table-panel">
          <div className="panel-head table-head">
            <div>
              <h2>Detalle por línea{activeUnit !== "ALL" ? ` — ${UNIT_META[activeUnit].label}` : ""}</h2>
              <p>Edita la cantidad (Q) de cualquier mes para recalcular la fila</p>
            </div>
            <div className="month-tabs">
              <button className={activeMonth === "TOTAL" ? "active" : ""} onClick={() => setActiveMonth("TOTAL")}>Jul–Dic</button>
              {MONTHS.map((m) => (
                <button key={m} className={activeMonth === m ? "active" : ""} onClick={() => setActiveMonth(m)}>
                  {MONTH_SHORT[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th className="col-expand"></th>
                  <th className="col-unit">Unidad</th>
                  <th className="col-line">Línea / referencia</th>
                  <th className="col-um">U .MEDIDA</th>
                  <th className="num col-qpresup">Cantidad</th>
                  <th className="num col-precio">Precio</th>
                  <th className="num">Ingresos</th>
                  <th className="num">Egresos</th>
                  <th className="num">Utilidad</th>
                  <th className="num col-real col-qreal">Q real</th>
                  <th className="num col-real">Ingresos reales</th>
                  <th className="num col-real">Egresos reales</th>
                  <th className="num col-real">Utilidad real</th>
                  <th className="col-delete"></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const cell = activeMonth === "TOTAL" ? null : item.meses[activeMonth];
                  const q = activeMonth === "TOTAL" ? MONTHS.reduce((a, m) => a + (item.meses[m].q || 0), 0) : cell.q;
                  const precio = activeMonth === "TOTAL" ? item.meses[MONTHS[0]].precio : cell.precio;
                  const ingresos = activeMonth === "TOTAL" ? item.ingresos_total : cell.ingresos;
                  const egresos = activeMonth === "TOTAL" ? item.egresos_total : cell.egresos;
                  const utilidad = activeMonth === "TOTAL" ? item.utilidad_total : cell.utilidad;
                  const editable = true;
                  const qtyEditable = activeMonth !== "TOTAL";
                  const edited = activeMonth !== "TOTAL" && cell.edited;

                  const realQEditable = activeMonth !== "TOTAL" && !!cell;
                  const realQ = activeMonth === "TOTAL" ? item.real_ingresos_total > 0 ? MONTHS.reduce((a, m) => a + (item.meses[m].real_q || 0), 0) : null : cell.real_q;
                  const realIngresos = activeMonth === "TOTAL" ? item.real_ingresos_total : (cell.has_real ? cell.real_ingresos : null);
                  const realEgresos = activeMonth === "TOTAL" ? item.real_egresos_total : (cell.has_real ? cell.real_egresos : null);
                  const realUtilidad = activeMonth === "TOTAL" ? item.real_utilidad_total : (cell.has_real ? cell.real_utilidad : null);
                  const hasRealHere = activeMonth === "TOTAL" ? item.real_registrado : cell.has_real;

                  const salesKey = activeMonth !== "TOTAL" ? `${item.idx}|${activeMonth}` : null;
                  const saleLog = salesKey ? (sales[salesKey] || []) : [];
                  const hasSaleLog = saleLog.length > 0;
                  const canExpand = activeMonth !== "TOTAL" && !!cell;
                  const isExpanded = expandedRow === item.idx && canExpand;
                  const realIngresosEditable = activeMonth !== "TOTAL" && !!cell;

                  return (
                    <React.Fragment key={item.idx}>
                    <tr className={edited ? "edited-row" : ""}>
                      <td className="col-expand">
                        {canExpand && (
                          <button
                            className={"expand-toggle" + (isExpanded ? " open" : "") + (hasSaleLog ? " has-log" : "")}
                            onClick={() => setExpandedRow(isExpanded ? null : item.idx)}
                            title="Registrar venta a venta"
                          >
                            {isExpanded ? "▾" : "▸"}
                          </button>
                        )}
                      </td>
                      <td className="col-unit">
                        <span className="unit-tag" style={{ color: UNIT_META[item.unidad].color, borderColor: UNIT_META[item.unidad].color }}>
                          {UNIT_META[item.unidad].label}
                        </span>
                      </td>
                      <td className="col-line">
                        <div className="line-name">{item.linea}</div>
                        <div className="ref-name">{item.referencia}</div>
                      </td>
                      <td className="muted col-um">{item.um}</td>
                      <td className="num">
                        {qtyEditable ? (
                          <NumberInput
                            className="qty-input qpresup-input"
                            value={q}
                            onChange={(value) => setQty(item.idx, activeMonth, value)}
                          />
                        ) : (
                          <span className="muted">{q}</span>
                        )}
                      </td>
                      <td className="num">
                        {editable ? (
                          <CurrencyInput
                            className="qty-input price-input"
                            placeholder="—"
                            value={precio}
                            onChange={(digits) => activeMonth === "TOTAL" ? setPriceAllMonths(item.idx, digits) : setPrice(item.idx, activeMonth, digits)}
                          />
                        ) : (
                          <span className="muted">{precio != null ? fmtCOP(precio) : "—"}</span>
                        )}
                      </td>
                      <td className="num">{fmtCOP(ingresos)}</td>
                      <td className="num muted">{fmtCOP(egresos)}</td>
                      <td className="num accent">{fmtCOP(utilidad)}</td>
                      <td className="num col-real col-qreal">
                        {realQEditable ? (
                          hasSaleLog ? (
                            <span className="muted real-locked" title="Calculado desde el registro venta a venta">
                              {realQ}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              placeholder="—"
                              className="qty-input real-input qreal-input"
                              value={realQ === undefined || realQ === null ? "" : realQ}
                              onChange={(e) => setRealQty(item.idx, activeMonth, e.target.value)}
                            />
                          )
                        ) : (
                          <span className="muted">{realQ != null ? realQ : "—"}</span>
                        )}
                      </td>
                      <td className="num col-real">
                        {hasSaleLog ? (
                          <span className="muted real-locked" title="Calculado desde el registro venta a venta">
                            {fmtCOP(realIngresos)}
                          </span>
                        ) : realIngresosEditable ? (
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="—"
                            className="qty-input real-input real-ingresos-input"
                            value={realIngresos === undefined || realIngresos === null ? "" : realIngresos}
                            onChange={(e) => setRealIngresos(item.idx, activeMonth, e.target.value)}
                          />
                        ) : (
                          <span className="muted">{realIngresos != null ? fmtCOP(realIngresos) : "—"}</span>
                        )}
                      </td>
                      <td className="num col-real muted">{realEgresos != null ? fmtCOP(realEgresos) : "—"}</td>
                      <td className="num col-real accent">{realUtilidad != null ? fmtCOP(realUtilidad) : "—"}</td>
                      <td className="col-delete">
                        {activeMonth !== "TOTAL" && hasRealHere && (
                          <button
                            className="delete-real-btn"
                            onClick={() => clearRealForCell(item.idx, activeMonth)}
                            title="Eliminar registro de venta real de este mes"
                          >
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="sale-log-row">
                        <td></td>
                        <td colSpan={13}>
                          <SaleLog
                            entries={saleLog}
                            precio={cell.precio}
                            unit={item.um}
                            onAdd={(entry) => addSale(item.idx, activeMonth, entry, cell.precio)}
                            onRemove={(saleId) => removeSale(item.idx, activeMonth, saleId)}
                          />
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6}>Total {activeUnit === "ALL" ? "general" : UNIT_META[activeUnit].label}</td>
                  <td className="num">{fmtCOP(totals.ingresos)}</td>
                  <td className="num">{fmtCOP(totals.egresos)}</td>
                  <td className="num accent">{fmtCOP(totals.utilidad)}</td>
                  <td className="num col-real">—</td>
                  <td className="num col-real">{fmtCOP(totals.realIngresos)}</td>
                  <td className="num col-real muted">{fmtCOP(totals.realEgresos)}</td>
                  <td className="num col-real accent">{fmtCOP(totals.realUtilidad)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
        </>
        )}

        <footer className="app-footer">
          {view === "presupuesto"
            ? "Datos base: Presupuesto_manizales_comparte (Jul–Dic 2026). Los cambios de cantidad se guardan solo en este navegador."
            : "El tablero de control se guarda solo en este navegador, igual que el presupuesto."}
        </footer>
      </main>

      {toast && <div className="toast">{toast}</div>}

      {presentationOpen && (
        <ExecutivePresentation
          slideIndex={slideIndex}
          setSlideIndex={setSlideIndex}
          onClose={() => setPresentationOpen(false)}
          companyTotals={companyTotals}
          companyMonthly={companyMonthly}
          unitCompareData={unitCompareData}
          unitMeta={UNIT_META}
          unitOrder={UNIT_ORDER}
          funnelTotals={funnelTotals}
          stages={FUNNEL_STAGES}
          vendedores={vendedores}
          metaAnual={metaAnual}
        />
      )}
    </div>
  );
}

function GanttChart({ data, colorFn, onRowClick, showBudgetValue = true }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.presupuesto, d.real)));
  return (
    <div className="gantt">
      {data.map((d) => {
        const pW = (d.presupuesto / max) * 100;
        const rW = (d.real / max) * 100;
        const over = d.anyReal && d.real >= d.presupuesto;
        const clickable = !!onRowClick;
        return (
          <div
            className={"gantt-row" + (clickable ? " clickable" : "")}
            key={d.key}
            onClick={clickable ? () => onRowClick(d.key) : undefined}
          >
            <div className="gantt-label">
              {colorFn && <span className="gantt-dot" style={{ background: colorFn(d.key) }} />}
              {d.label}
            </div>
            <div className="gantt-track">
              <div className="gantt-bar gantt-bar-budget" style={{ width: `${pW}%` }}>
                {showBudgetValue && <span className="gantt-bar-value budget-value">{fmtCOPShort(d.presupuesto)}</span>}
              </div>
              {d.anyReal && (
                <div
                  className={"gantt-bar gantt-bar-real" + (over ? " over" : "")}
                  style={{ width: `${Math.max(rW, 2)}%`, background: colorFn ? colorFn(d.key) : undefined }}
                >
                  <span className="gantt-bar-value real-value">{fmtCOPShort(d.real)}</span>
                </div>
              )}
            </div>
            <div className="gantt-status">
              {d.anyReal ? (
                <span className={over ? "var-pos" : "var-neg"}>
                  {over ? "✓ " : ""}{fmtPct(d.presupuesto > 0 ? d.real / d.presupuesto : 0)}
                </span>
              ) : (
                <span className="muted">sin registro</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="ct-row">
          <i style={{ background: p.stroke }} />
          <span>{p.dataKey}</span>
          <b>{fmtCOP(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{d.name}</div>
      <div className="ct-row">
        <b>{fmtCOP(d.value)}</b>
        <span className="muted"> · {fmtPct(d.value / (total || 1))}</span>
      </div>
    </div>
  );
}

function SaleLog({ entries, precio, unit, onAdd, onRemove }) {
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [valor, setValor] = useState("");
  const [cliente, setCliente] = useState("");

  const hasPrecio = precio != null;
  const totalQ = entries.reduce((a, s) => a + (s.cantidad || 0), 0);
  const totalValor = entries.reduce((a, s) => a + (s.valor || 0), 0);

  const submit = () => {
    if (hasPrecio) {
      if (!cantidad || Number(cantidad) <= 0) return;
      onAdd({ fecha, cantidad, cliente }, precio);
    } else {
      if (!valor || Number(valor) <= 0) return;
      onAdd({ fecha, valor, cliente }, precio);
    }
    setFecha("");
    setCantidad("");
    setValor("");
    setCliente("");
  };

  return (
    <div className="sale-log">
      <div className="sale-log-head">
        <span>Ventas registradas ({unit})</span>
        <span className="muted">
          {hasPrecio ? `${totalQ} ${unit.toLowerCase()} vendidos este mes · ` : ""}{fmtCOP(totalValor)}
        </span>
      </div>

      {entries.length > 0 && (
        <ul className="sale-log-list">
          {entries.map((s) => (
            <li key={s.id}>
              <span className="sale-fecha">{s.fecha || "Sin fecha"}</span>
              <span className="sale-cantidad">{hasPrecio ? `${s.cantidad} ${unit.toLowerCase()}` : "—"}</span>
              <span className="sale-cliente">{s.cliente || "—"}</span>
              <span className="sale-valor muted">{fmtCOP(s.valor != null ? s.valor : (hasPrecio && s.cantidad ? s.cantidad * precio : 0))}</span>
              <button className="sale-remove" onClick={() => onRemove(s.id)} title="Eliminar venta">✕</button>
            </li>
          ))}
        </ul>
      )}

      <div className="sale-log-form">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="sale-input" />
        {hasPrecio ? (
          <input
            type="number"
            min="1"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="sale-input sale-input-qty"
          />
        ) : (
          <input
            type="number"
            min="1"
            step="10000"
            placeholder="Valor (COP)"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="sale-input sale-input-qty"
          />
        )}
        <input
          type="text"
          placeholder="Cliente / nota (opcional)"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="sale-input sale-input-cliente"
        />
        <button className="sale-add-btn" onClick={submit}>+ Registrar venta</button>
      </div>
    </div>
  );
}

const MONTH_FROM_JS_INDEX = { 6: "Julio", 7: "Agosto", 8: "Septiembre", 9: "Octubre", 10: "Noviembre", 11: "Diciembre" };
const monthFromFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  return MONTH_FROM_JS_INDEX[d.getMonth()] || null;
};

function UnitSaleLog({ entries, lineOptions, unit, onAddLinea, onRemove }) {
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [valor, setValor] = useState("");
  const [rentaPct, setRentaPct] = useState("");
  const [cliente, setCliente] = useState("");
  const [lineaIdx, setLineaIdx] = useState("");

  const total = entries.reduce((a, s) => a + s.valor, 0);
  const totalRenta = entries.reduce((a, s) => {
    if (s.rentaPct == null) return a;
    const ut = Math.round(s.valor * (s.rentaPct / 100));
    return { utilidad: a.utilidad + ut, egresos: a.egresos + (s.valor - ut), any: true };
  }, { utilidad: 0, egresos: 0, any: false });
  const mes = monthFromFecha(fecha);
  const canSubmit = lineaIdx !== "" && !!mes && valor && Number(valor) > 0;

  const submit = () => {
    if (!canSubmit) return;
    onAddLinea(Number(lineaIdx), mes, { fecha, cantidad, valor, cliente, rentaPct });
    setFecha("");
    setCantidad("");
    setValor("");
    setRentaPct("");
    setCliente("");
    setLineaIdx("");
  };

  return (
    <div className="sale-log unit-sale-log" onClick={(e) => e.stopPropagation()}>
      <div className="sale-log-head">
        <span>Ventas registradas</span>
        <span className="muted">{entries.length} venta{entries.length !== 1 ? "s" : ""} · {fmtCOP(total)}</span>
      </div>
      {totalRenta.any && (
        <div className="unit-sale-renta-summary">
          <span>Egresos reales: <b>{fmtCOP(totalRenta.egresos)}</b></span>
          <span>Utilidad real: <b>{fmtCOP(totalRenta.utilidad)}</b></span>
        </div>
      )}

      {entries.length > 0 && (
        <ul className="unit-sale-log-list">
          {entries.map((s) => (
            <li key={s.combinedKey} className="unit-sale-entry">
              <div className="unit-sale-entry-top">
                <span className="sale-fecha">{s.fecha || "Sin fecha"}</span>
                {s.cantidad > 0 && <span className="sale-cantidad-tag">{s.cantidad} {UNIT_TICKET_LABEL[unit] || "tickets"}</span>}
                <span className="sale-valor">{fmtCOP(s.valor)}</span>
                <button className="sale-remove" onClick={() => onRemove(s)} title="Eliminar venta">🗑</button>
              </div>
              <div className="unit-sale-entry-bottom">
                <span className="sale-linea">
                  {s.tipo === "linea" ? s.referencia : <span className="muted">General</span>}
                </span>
                <span className="sale-cliente">{s.cliente || "—"}</span>
                {s.rentaPct != null && <span className="renta-tag">{s.rentaPct}%</span>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="sale-log-form unit-sale-log-form">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="sale-input" />
        <select
          className="sale-input vendedor-select unit-sale-linea-select"
          value={lineaIdx}
          onChange={(e) => setLineaIdx(e.target.value)}
        >
          <option value="" disabled>Selecciona línea/referencia</option>
          {lineOptions.map((o) => (
            <option key={o.idx} value={o.idx}>{o.label}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="1"
          placeholder={`Q ${UNIT_TICKET_LABEL[unit] || "tickets"}`}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="sale-input sale-input-cantidad"
          title="Cantidad de tickets/unidades de esta venta: se refleja en Q real del detalle por línea"
        />
        <input
          type="number"
          min="1"
          step="10000"
          placeholder="Valor (COP)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="sale-input sale-input-qty"
        />
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="% renta"
          value={rentaPct}
          onChange={(e) => setRentaPct(e.target.value)}
          className="sale-input sale-input-renta"
          title="% de renta de esta venta: calcula egresos y utilidad reales"
        />
        <input
          type="text"
          placeholder="Cliente / nota (opcional)"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="sale-input sale-input-cliente"
        />
        <button className="sale-add-btn" onClick={submit} disabled={!canSubmit}>+ Registrar venta</button>
      </div>
      {fecha && !mes && <p className="unit-sale-hint">Elige una fecha entre julio y diciembre de 2026.</p>}
    </div>
  );
}

function ControlDashboard({
  funnelData, funnelTotals, funnelAnyData, stages, unitMeta, unitOrder, onKpiChange, kpis, onReset,
  vendedores, onAddVendedor, onRemoveVendedor, onVendedorMeta, onVendedorAvance, onVendedorUnidad,
  unitCompareData, onUnitClick, ganttData, ganttMetric, onGanttMetricChange, hasReal, activeUnit,
}) {
  const [printingId, setPrintingId] = useState(null);

  useEffect(() => {
    const clearPrinting = () => setPrintingId(null);
    window.addEventListener("afterprint", clearPrinting);
    return () => window.removeEventListener("afterprint", clearPrinting);
  }, []);

  const handlePrint = (id) => {
    setPrintingId(id);
    setTimeout(() => window.print(), 60);
  };

  return (
    <>
      <section className={"panel unit-gantt-panel" + (printingId === "uen-chart" ? " print-active" : "")}>
        <div className="panel-head table-head">
          <div>
            <h2>Ventas por cada U.E.N.</h2>
            <p>Presupuesto vs. ventas reales registradas, por unidad estratégica de negocio</p>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint("uen-chart")} title="Imprimir este gráfico">
            🖨️ Imprimir
          </button>
        </div>
        <GanttChart
          data={unitCompareData}
          colorFn={(u) => unitMeta[u].color}
          onRowClick={onUnitClick}
          showBudgetValue={false}
        />
      </section>

      <section className={"panel gantt-panel" + (printingId === "cronograma-chart" ? " print-active" : "")}>
        <div className="panel-head table-head">
          <div>
            <h2>Presupuesto vs. real — cronograma Jul–Dic{activeUnit !== "ALL" ? ` · ${unitMeta[activeUnit].label}` : ""}</h2>
            <p>Cada fila es un mes: la franja tenue es lo presupuestado, la franja de color es lo realmente vendido</p>
          </div>
          <div className="month-tabs no-print">
            <button className={ganttMetric === "ingresos" ? "active" : ""} onClick={() => onGanttMetricChange("ingresos")}>Ingresos</button>
            <button className={ganttMetric === "utilidad" ? "active" : ""} onClick={() => onGanttMetricChange("utilidad")}>Utilidad</button>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint("cronograma-chart")} title="Imprimir este gráfico">
            🖨️ Imprimir
          </button>
        </div>
        <GanttChart data={ganttData} />
        {!hasReal && (
          <p className="gantt-empty">
            Aún no has registrado ventas reales. Ve a "Presupuesto de ventas" y diligencia la
            columna <b>Q real</b> o <b>Ingresos reales</b> de cualquier línea para verla comparada aquí.
          </p>
        )}
      </section>

      <section className="panel kpi-registro-panel">
        <div className="panel-head">
          <h2>Caja de registro de KPI</h2>
          <p>Diligencia, por unidad estratégica, los indicadores del embudo comercial del mes</p>
        </div>

        <div className="kpi-registro-grid">
          {unitOrder.map((u) => {
            const meta = unitMeta[u];
            const k = kpis[u] || {};
            return (
              <div key={u} className="kpi-registro-card" style={{ borderColor: meta.color }}>
                <div className="kpi-registro-title">
                  <span className="unit-dot" style={{ background: meta.color }} />
                  {meta.label}
                </div>
                {stages.map((s) => (
                  <label key={s.key} className="kpi-registro-field">
                    {s.short}
                    <input
                      type="number"
                      min="0"
                      value={k[s.key] === undefined ? "" : k[s.key]}
                      placeholder="0"
                      onChange={(e) => onKpiChange(u, s.key, e.target.value)}
                    />
                  </label>
                ))}
              </div>
            );
          })}
        </div>

        <div className="sidebar-footer gantt-reset">
          <button className="reset-btn" onClick={onReset}>
            ↺ Reiniciar tablero de control
          </button>
        </div>
      </section>

      <section className={"panel seguimiento-panel" + (printingId === "seguimiento-chart" ? " print-active" : "")}>
        <div className="panel-head table-head">
          <div>
            <h2>Caja de seguimiento y avance</h2>
            <p>Conversión entre etapas del embudo, consolidado de todas las unidades estratégicas</p>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint("seguimiento-chart")} title="Imprimir este gráfico">
            🖨️ Imprimir
          </button>
        </div>

        {!funnelAnyData ? (
          <p className="gantt-empty">
            Aún no registras indicadores. Diligencia la caja de registro de KPI arriba para ver
            aquí el embudo y las tasas de conversión.
          </p>
        ) : (
          <>
            <div className="funnel-total">
              {stages.map((s, i) => (
                <div className="funnel-total-stage" key={s.key}>
                  <div className="funnel-total-bar-wrap">
                    <div
                      className="funnel-total-bar"
                      style={{ width: `${funnelTotals[0] > 0 ? Math.max(4, (funnelTotals[i] / funnelTotals[0]) * 100) : 0}%` }}
                    />
                  </div>
                  <div className="funnel-total-label">
                    <span>{s.label}</span>
                    <b>{funnelTotals[i]}</b>
                  </div>
                  {i > 0 && (
                    <span className="funnel-conv">
                      {funnelTotals[i - 1] > 0 ? fmtPct(funnelTotals[i] / funnelTotals[i - 1]) : "—"} vs. etapa anterior
                    </span>
                  )}
                </div>
              ))}
              <div className="funnel-total-close">
                Tasa de cierre general: <b>{funnelTotals[0] > 0 ? fmtPct(funnelTotals[stages.length - 1] / funnelTotals[0]) : "—"}</b>
                {" "}(prospectos → ventas cerradas)
              </div>
            </div>

            <div className="unit-funnel-grid">
              {funnelData.filter((d) => d.vals.some((v) => v > 0)).map((d) => (
                <div className="unit-funnel-card" key={d.unit} style={{ borderColor: d.color }}>
                  <div className="kpi-registro-title">
                    <span className="unit-dot" style={{ background: d.color }} />
                    {d.label}
                  </div>
                  {stages.map((s, i) => (
                    <div className="unit-funnel-row" key={s.key}>
                      <span className="unit-funnel-stage">{s.short}</span>
                      <div className="unit-funnel-track">
                        <div
                          className="unit-funnel-bar"
                          style={{
                            width: `${d.vals[0] > 0 ? Math.max(3, (d.vals[i] / d.vals[0]) * 100) : 0}%`,
                            background: d.color,
                          }}
                        />
                      </div>
                      <span className="unit-funnel-value">{d.vals[i]}</span>
                    </div>
                  ))}
                  <div className="unit-funnel-close muted">
                    Cierre: {d.vals[0] > 0 ? fmtPct(d.vals[stages.length - 1] / d.vals[0]) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <VendedoresPanel
        vendedores={vendedores}
        stages={stages}
        unitMeta={unitMeta}
        unitOrder={unitOrder}
        onAdd={onAddVendedor}
        onRemove={onRemoveVendedor}
        onMeta={onVendedorMeta}
        onAvance={onVendedorAvance}
        onUnidad={onVendedorUnidad}
      />
    </>
  );
}

function VendedoresPanel({ vendedores, stages, unitMeta, unitOrder, onAdd, onRemove, onMeta, onAvance, onUnidad }) {
  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState("ALL");

  const submit = () => {
    if (!nombre.trim()) return;
    onAdd(nombre, unidad);
    setNombre("");
    setUnidad("ALL");
  };

  return (
    <section className="panel vendedores-panel">
      <div className="panel-head">
        <h2>Vendedores · metas y avance por indicador</h2>
        <p>Registra cada vendedor con su meta de prospectos, citas, visitas, propuestas y ventas cerradas, y actualiza su avance real</p>
      </div>

      <div className="vendedor-add-form">
        <input
          type="text"
          className="sale-input"
          placeholder="Nombre del vendedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <select className="sale-input vendedor-select" value={unidad} onChange={(e) => setUnidad(e.target.value)}>
          <option value="ALL">Sin unidad asignada</option>
          {unitOrder.map((u) => (
            <option key={u} value={u}>{unitMeta[u].label}</option>
          ))}
        </select>
        <button className="sale-add-btn" onClick={submit}>+ Agregar vendedor</button>
      </div>

      {vendedores.length === 0 ? (
        <p className="gantt-empty">
          Aún no has registrado vendedores. Agrega uno arriba para asignarle metas y llevar su avance.
        </p>
      ) : (
        <div className="vendedores-grid">
          {vendedores.map((v) => {
            const meta = unitMeta[v.unidad];
            const color = meta ? meta.color : "#8FA398";
            const cierreMeta = v.metas.ventas || 0;
            const cierreAvance = v.avance.ventas || 0;
            const cierrePct = cierreMeta > 0 ? cierreAvance / cierreMeta : null;
            return (
              <div className="vendedor-card" key={v.id} style={{ borderColor: color }}>
                <div className="vendedor-card-head">
                  <div className="vendedor-card-title">
                    <span className="unit-dot" style={{ background: color }} />
                    {v.nombre}
                  </div>
                  <button className="sale-remove" onClick={() => onRemove(v.id)} title="Eliminar vendedor">✕</button>
                </div>

                <select
                  className="sale-input vendedor-select vendedor-select-inline"
                  value={v.unidad}
                  onChange={(e) => onUnidad(v.id, e.target.value)}
                >
                  <option value="ALL">Sin unidad asignada</option>
                  {unitOrder.map((u) => (
                    <option key={u} value={u}>{unitMeta[u].label}</option>
                  ))}
                </select>

                <div className="vendedor-table">
                  <div className="vendedor-table-head">
                    <span></span>
                    <span>Meta</span>
                    <span>Avance</span>
                    <span>%</span>
                  </div>
                  {stages.map((s) => {
                    const m = v.metas[s.key] || 0;
                    const a = v.avance[s.key] || 0;
                    const pct = m > 0 ? a / m : null;
                    return (
                      <div className="vendedor-row" key={s.key}>
                        <span className="vendedor-row-label">{s.short}</span>
                        <input
                          type="number"
                          min="0"
                          value={m === 0 ? "" : m}
                          placeholder="0"
                          onChange={(e) => onMeta(v.id, s.key, e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          value={a === 0 ? "" : a}
                          placeholder="0"
                          onChange={(e) => onAvance(v.id, s.key, e.target.value)}
                        />
                        <span className={pct == null ? "muted" : pct >= 1 ? "var-pos" : "var-neg"}>
                          {pct != null ? fmtPct(pct) : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="vendedor-card-foot">
                  {cierrePct != null ? (
                    <>
                      <div className="progress-track">
                        <div
                          className={"progress-fill" + (cierrePct >= 1 ? " real-fill" : "")}
                          style={{ width: `${Math.min(100, cierrePct * 100)}%`, background: cierrePct >= 1 ? undefined : color }}
                        />
                      </div>
                      <span className="kpi-note">Cumplimiento en ventas cerradas: {fmtPct(cierrePct)}</span>
                    </>
                  ) : (
                    <span className="muted">Define la meta de ventas para ver su cumplimiento</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ExecutivePresentation({
  slideIndex, setSlideIndex, onClose,
  companyTotals, companyMonthly, unitCompareData, unitMeta, unitOrder,
  funnelTotals, stages, vendedores, metaAnual,
}) {
  const SLIDE_COUNT = 7;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setSlideIndex((i) => Math.min(SLIDE_COUNT - 1, i + 1));
      else if (e.key === "ArrowLeft") setSlideIndex((i) => Math.max(0, i - 1));
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSlideIndex, onClose]);

  const next = () => setSlideIndex((i) => Math.min(SLIDE_COUNT - 1, i + 1));
  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));

  const rankedUnits = unitOrder
    .map((u) => unitCompareData.find((d) => d.key === u))
    .filter((d) => d && d.anyReal && d.presupuesto > 0)
    .sort((a, b) => (b.real / b.presupuesto) - (a.real / a.presupuesto));
  const bestUnit = rankedUnits[0];
  const worstUnit = rankedUnits.length > 1 ? rankedUnits[rankedUnits.length - 1] : null;

  const monthsWithReal = companyMonthly.filter((m) => m.anyReal);
  const bestMonth = monthsWithReal.length
    ? monthsWithReal.reduce((a, b) => (b.ingresosR > a.ingresosR ? b : a))
    : null;

  const rankedVendedores = vendedores
    .map((v) => ({ ...v, pct: v.metas.ventas > 0 ? v.avance.ventas / v.metas.ventas : null }))
    .filter((v) => v.pct != null)
    .sort((a, b) => b.pct - a.pct);

  const todayStr = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const maxUnitVal = Math.max(1, ...unitCompareData.map((d) => Math.max(d.presupuesto, d.real)));
  const maxMonthVal = Math.max(1, ...companyMonthly.map((m) => Math.max(m.ingresosP, m.ingresosR)));
  const metaPct = metaAnual > 0 ? companyTotals.presupuesto / metaAnual : null;

  return (
    <div className="presentation-overlay">
      <div className="presentation-topbar no-print">
        <span className="presentation-counter">Diapositiva {slideIndex + 1} de {SLIDE_COUNT}</span>
        <div className="presentation-actions">
          <button onClick={() => window.print()}>🖨️ Imprimir</button>
          <button onClick={onClose}>✕ Cerrar</button>
        </div>
      </div>

      <div className="presentation-slide-wrap">
        {slideIndex === 0 && (
          <section className="pres-slide pres-cover">
            <p className="pres-eyebrow">Manizales Comparte · Junta directiva</p>
            <h1>Presupuesto de ventas</h1>
            <h2 className="pres-cover-sub">Segundo semestre 2026 — Julio a diciembre</h2>
            <div className="pres-cover-meta">
              <span>Presentación ejecutiva</span>
              <span>·</span>
              <span>{todayStr}</span>
            </div>
          </section>
        )}

        {slideIndex === 1 && (
          <section className="pres-slide">
            <h2 className="pres-title">Resumen ejecutivo</h2>
            <div className="pres-kpi-grid">
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">Presupuesto Jul–Dic</span>
                <span className="pres-kpi-value">{fmtCOP(companyTotals.presupuesto)}</span>
              </div>
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">Ventas reales registradas</span>
                <span className="pres-kpi-value accent">
                  {companyTotals.anyReal ? fmtCOP(companyTotals.real) : "Sin registrar"}
                </span>
              </div>
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">% de cumplimiento</span>
                <span className="pres-kpi-value">{companyTotals.pct != null ? fmtPct(companyTotals.pct) : "—"}</span>
              </div>
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">Utilidad real</span>
                <span className="pres-kpi-value accent">
                  {companyTotals.anyReal ? fmtCOP(companyTotals.realUtilidad) : "Sin registrar"}
                </span>
              </div>
            </div>
            {metaPct != null && (
              <p className="pres-note">
                El presupuesto del semestre representa el <b>{fmtPct(metaPct)}</b> de la meta anual de ventas 2026
                ({fmtCOP(metaAnual)}).
              </p>
            )}
          </section>
        )}

        {slideIndex === 2 && (
          <section className="pres-slide">
            <h2 className="pres-title">Ventas por cada U.E.N.</h2>
            <div className="pres-bars">
              {unitCompareData.map((d) => (
                <div className="pres-bar-row" key={d.key}>
                  <span className="pres-bar-label">{d.label}</span>
                  <div className="pres-bar-track">
                    <div className="pres-bar-budget" style={{ width: `${(d.presupuesto / maxUnitVal) * 100}%` }} />
                    {d.anyReal && (
                      <div
                        className="pres-bar-real"
                        style={{ width: `${(d.real / maxUnitVal) * 100}%`, background: unitMeta[d.key].color }}
                      />
                    )}
                  </div>
                  <span className="pres-bar-value">
                    {d.anyReal ? fmtCOPShort(d.real) : "—"} / {fmtCOPShort(d.presupuesto)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pres-legend">
              <span><i className="pres-legend-dot budget" /> Presupuesto</span>
              <span><i className="pres-legend-dot real" /> Ventas reales</span>
            </div>
          </section>
        )}

        {slideIndex === 3 && (
          <section className="pres-slide">
            <h2 className="pres-title">Cronograma mensual — Ingresos</h2>
            <div className="pres-bars">
              {companyMonthly.map((m) => (
                <div className="pres-bar-row" key={m.key}>
                  <span className="pres-bar-label">{m.label}</span>
                  <div className="pres-bar-track">
                    <div className="pres-bar-budget" style={{ width: `${(m.ingresosP / maxMonthVal) * 100}%` }} />
                    {m.anyReal && (
                      <div className="pres-bar-real" style={{ width: `${(m.ingresosR / maxMonthVal) * 100}%` }} />
                    )}
                  </div>
                  <span className="pres-bar-value">
                    {m.anyReal ? fmtCOPShort(m.ingresosR) : "—"} / {fmtCOPShort(m.ingresosP)}
                  </span>
                </div>
              ))}
            </div>
            {bestMonth && (
              <p className="pres-note">
                <b>{bestMonth.label}</b> es el mes con mayores ingresos reales registrados hasta ahora
                ({fmtCOP(bestMonth.ingresosR)}).
              </p>
            )}
          </section>
        )}

        {slideIndex === 4 && (
          <section className="pres-slide">
            <h2 className="pres-title">Embudo comercial consolidado</h2>
            {funnelTotals[0] > 0 ? (
              <div className="pres-funnel">
                {stages.map((s, i) => (
                  <div className="pres-funnel-stage" key={s.key}>
                    <div className="pres-funnel-bar-wrap">
                      <div
                        className="pres-funnel-bar"
                        style={{ width: `${Math.max(4, (funnelTotals[i] / funnelTotals[0]) * 100)}%` }}
                      />
                    </div>
                    <div className="pres-funnel-label">
                      <span>{s.label}</span>
                      <b>{funnelTotals[i]}</b>
                    </div>
                  </div>
                ))}
                <p className="pres-note">
                  Tasa de cierre general: <b>{fmtPct(funnelTotals[stages.length - 1] / funnelTotals[0])}</b> (prospectos → ventas cerradas)
                </p>
              </div>
            ) : (
              <p className="pres-empty">Aún no se han registrado indicadores del embudo comercial.</p>
            )}
          </section>
        )}

        {slideIndex === 5 && (
          <section className="pres-slide">
            <h2 className="pres-title">Vendedores destacados</h2>
            {rankedVendedores.length ? (
              <table className="pres-table">
                <thead>
                  <tr><th>Vendedor</th><th className="num">Meta ventas</th><th className="num">Avance</th><th className="num">% cumplimiento</th></tr>
                </thead>
                <tbody>
                  {rankedVendedores.map((v) => (
                    <tr key={v.id}>
                      <td>{v.nombre}</td>
                      <td className="num">{v.metas.ventas}</td>
                      <td className="num">{v.avance.ventas}</td>
                      <td className="num"><b className={v.pct >= 1 ? "pos" : ""}>{fmtPct(v.pct)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="pres-empty">Aún no hay vendedores con meta de ventas registrada.</p>
            )}
          </section>
        )}

        {slideIndex === 6 && (
          <section className="pres-slide">
            <h2 className="pres-title">Conclusiones y próximos pasos</h2>
            <ul className="pres-conclusions">
              {companyTotals.anyReal ? (
                <li>
                  Llevamos <b>{fmtPct(companyTotals.pct)}</b> de cumplimiento del presupuesto del semestre
                  ({fmtCOP(companyTotals.real)} de {fmtCOP(companyTotals.presupuesto)} presupuestados).
                </li>
              ) : (
                <li>Aún no se han registrado ventas reales del semestre para medir el cumplimiento.</li>
              )}
              {bestUnit && (
                <li>
                  <b>{bestUnit.label}</b> es la unidad con mejor cumplimiento
                  ({fmtPct(bestUnit.real / bestUnit.presupuesto)}).
                </li>
              )}
              {worstUnit && (
                <li>
                  <b>{worstUnit.label}</b> es la unidad con mayor oportunidad de mejora
                  ({fmtPct(worstUnit.real / worstUnit.presupuesto)} de cumplimiento) — requiere atención prioritaria.
                </li>
              )}
              {bestMonth && (
                <li><b>{bestMonth.label}</b> fue el mes de mejor desempeño en ingresos reales.</li>
              )}
              <li>Próximo paso: definir acciones comerciales concretas para las unidades y meses rezagados frente al presupuesto.</li>
            </ul>
          </section>
        )}
      </div>

      <div className="presentation-nav no-print">
        <button onClick={prev} disabled={slideIndex === 0}>← Anterior</button>
        <div className="presentation-dots">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              className={"pres-dot" + (i === slideIndex ? " active" : "")}
              onClick={() => setSlideIndex(i)}
              title={`Diapositiva ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} disabled={slideIndex === SLIDE_COUNT - 1}>Siguiente →</button>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

.app-root {
  display: flex;
  min-height: 100vh;
  background: #12201A;
  color: #F2EDE1;
  font-family: 'IBM Plex Sans', sans-serif;
}
.loading-root { align-items: center; justify-content: center; }
.loading-mark { font-family: 'Fraunces', serif; font-size: 15px; letter-spacing: 0.3em; color: #D9A441; opacity: 0.8; }

/* Sidebar */
.sidebar {
  width: 264px;
  flex-shrink: 0;
  background: #0F1B15;
  border-right: 1px solid #223327;
  display: flex;
  flex-direction: column;
  padding: 28px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.brand { display: flex; align-items: center; gap: 12px; padding: 0 6px 26px; border-bottom: 1px solid #223327; margin-bottom: 20px; }
.brand-mark {
  width: 38px; height: 38px; border-radius: 8px;
  background: linear-gradient(155deg, #D9A441, #B5583A);
  color: #12201A; font-family: 'Fraunces', serif; font-weight: 700; font-size: 15px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.brand-title { font-family: 'Fraunces', serif; font-size: 15.5px; font-weight: 600; line-height: 1.25; }
.brand-sub { font-size: 11px; color: #8FA398; margin-top: 2px; }

.unit-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.unit-btn {
  display: flex; align-items: center; gap: 10px;
  background: transparent; border: 1px solid transparent; border-radius: 8px;
  padding: 10px 10px; color: #C9D6CC; font-family: inherit; font-size: 13px;
  cursor: pointer; text-align: left; transition: background 0.15s, border-color 0.15s;
}
.unit-btn:hover { background: #182920; }
.unit-btn.active { background: #1B2E23; border-color: #33493A; color: #F2EDE1; }
.unit-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.all-dot { background: #F2EDE1; }
.unit-btn-label { flex: 1; }
.unit-btn-value { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: #8FA398; }

.sidebar-footer { padding-top: 16px; border-top: 1px solid #223327; margin-top: 12px; }
.reset-btn {
  width: 100%; background: #182920; border: 1px solid #2C4234; color: #E8CBA8;
  border-radius: 8px; padding: 9px 10px; font-family: inherit; font-size: 12.5px;
  cursor: pointer; margin-bottom: 10px; transition: opacity 0.15s;
}
.reset-btn:disabled { opacity: 0.4; cursor: default; }
.reset-btn:not(:disabled):hover { border-color: #D9A441; }
.save-indicator { font-size: 11px; color: #6E8578; text-align: center; }
.save-indicator.saved { color: #4FA391; }

/* Main */
.main { flex: 1; min-width: 0; padding: 32px 40px 60px; }

.page-header { position: relative; padding: 30px 34px; border-radius: 16px; overflow: hidden; background: #16261C; border: 1px solid #22362A; margin-bottom: 28px; }
.topo-wrap { position: absolute; inset: 0; opacity: 0.9; pointer-events: none; }
.topo { width: 100%; height: 100%; }
.topo path { fill: none; stroke: #2A4232; stroke-width: 1.4; }
.topo path.topo-2 { stroke: #1D3226; }
.header-content { position: relative; max-width: 620px; }
.eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #D9A441; margin: 0 0 10px; }
.page-header h1 { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 600; margin: 0 0 12px; line-height: 1.1; }
.header-desc { font-size: 14px; color: #B7C6BB; line-height: 1.55; margin: 0; }

.kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 26px; }
.kpi-card { background: #16261C; border: 1px solid #22362A; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
.kpi-label { font-size: 11.5px; color: #8FA398; text-transform: uppercase; letter-spacing: 0.05em; }
.kpi-value { font-family: 'IBM Plex Mono', monospace; font-size: 21px; font-weight: 500; }
.kpi-note { font-size: 11.5px; color: #6E8578; }
.kpi-note.gold { color: #D9A441; }
.kpi-note.clay { color: #C97656; }
.kpi-note.teal { color: #4FA391; }
.progress-card { justify-content: center; }
.progress-track { height: 7px; background: #223327; border-radius: 99px; overflow: hidden; margin: 4px 0; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #4FA391, #D9A441); border-radius: 99px; }
.real-fill { background: linear-gradient(90deg, #5FBEDB, #F2EDE1); }
.legend-row i.dashed { width: 14px; height: 0; border-top: 2px dashed #F2EDE1; background: none !important; border-radius: 0; }

.chart-grid { display: grid; grid-template-columns: 1.7fr 1fr; gap: 16px; margin-bottom: 22px; }
.panel { background: #16261C; border: 1px solid #22362A; border-radius: 14px; padding: 22px 24px; }
.panel-head h2 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; margin: 0 0 3px; }
.panel-head p { font-size: 12px; color: #8FA398; margin: 0 0 14px; }
.legend-row { display: flex; gap: 18px; margin-top: 10px; font-size: 12px; color: #C9D6CC; }
.legend-row span { display: flex; align-items: center; gap: 6px; }
.legend-row i { width: 9px; height: 9px; border-radius: 2px; display: inline-block; }

.pie-legend { list-style: none; padding: 0; margin: 6px 0 0; display: flex; flex-direction: column; gap: 7px; }
.pie-legend li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; cursor: pointer; padding: 4px 6px; border-radius: 6px; }
.pie-legend li:hover, .pie-legend li.active { background: #1B2E23; }
.pie-legend i { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pie-legend span { flex: 1; color: #C9D6CC; }
.pie-legend b { font-family: 'IBM Plex Mono', monospace; font-weight: 500; color: #F2EDE1; font-size: 11.5px; }

.chart-tooltip { background: #0F1B15; border: 1px solid #33493A; border-radius: 8px; padding: 10px 12px; font-size: 12px; }
.ct-label { color: #D9A441; font-family: 'IBM Plex Mono', monospace; font-size: 11px; margin-bottom: 6px; }
.ct-row { display: flex; align-items: center; gap: 6px; color: #C9D6CC; }
.ct-row i { width: 7px; height: 7px; border-radius: 50%; }
.ct-row b { margin-left: auto; font-family: 'IBM Plex Mono', monospace; color: #F2EDE1; }

.unit-real-panel { margin-bottom: 22px; }
.unit-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; margin-top: 16px; }
.unit-card { background: #0F1B15; border: 1px solid #22362A; border-radius: 12px; padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.unit-card.active { background: #172619; }
.unit-card-head { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.unit-card-title { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 600; }
.unit-card-budget { font-size: 11.5px; color: #8FA398; }
.unit-card-budget b { color: #C9D6CC; font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
.unit-card-real-total {
  font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #6E8578;
  display: flex; flex-direction: column; gap: 3px;
}
.unit-card-real-total b { font-size: 15px; text-transform: none; letter-spacing: normal; color: #F2EDE1; font-family: 'IBM Plex Mono', monospace; }
.unit-log-toggle {
  width: 100%; text-align: left; background: #12201A; border: 1px solid #2C4234; color: #8FA398;
  border-radius: 7px; padding: 7px 10px; font-family: inherit; font-size: 11.5px; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.unit-log-toggle:hover { background: #182920; color: #F2EDE1; }
.unit-log-toggle.has-log { color: #D9A441; }
.unit-log-toggle.open { color: #F2EDE1; background: #182920; }
.unit-sale-log { border: 1px solid #22362A; border-radius: 8px; margin-top: 2px; }
.unit-sale-log-list {
  list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 6px;
}
.unit-sale-entry {
  background: #16261C; border: 1px solid #22362A; border-radius: 7px; padding: 8px 10px;
  display: flex; flex-direction: column; gap: 5px; min-width: 0;
}
.unit-sale-entry-top { display: flex; align-items: center; gap: 10px; min-width: 0; }
.unit-sale-entry-top .sale-fecha { flex-shrink: 0; font-size: 11.5px; }
.unit-sale-entry-top .sale-valor { flex: 1; font-size: 13.5px; }
.unit-sale-entry-top .sale-remove { flex-shrink: 0; }
.unit-sale-entry-bottom {
  display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 11.5px; color: #8FA398;
}
.unit-sale-entry-bottom .sale-linea {
  color: #C9D6CC; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
}
.unit-sale-entry-bottom .sale-cliente {
  flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;
}
.unit-sale-entry-bottom .renta-tag { flex-shrink: 0; }
.unit-sale-log-form { align-items: center; }
.unit-sale-linea-select { flex: 1; min-width: 190px; }
.unit-sale-hint { font-size: 11px; color: #C97656; margin: 6px 0 0; }
.sale-input-renta { width: 78px; }
.sale-input-cantidad { width: 82px; }
.sale-cantidad-tag {
  font-size: 10.5px; color: #D9A441; border: 1px solid #4A3B22; border-radius: 4px;
  padding: 1px 6px; white-space: nowrap; flex-shrink: 0;
}
.unit-sale-renta-summary {
  display: flex; justify-content: space-between; gap: 10px; font-size: 11.5px; color: #8FA398;
  background: #101D17; border: 1px solid #22362A; border-radius: 6px; padding: 6px 10px; margin-bottom: 10px;
}
.unit-sale-renta-summary b { color: #F2EDE1; font-family: 'IBM Plex Mono', monospace; }
.renta-tag {
  font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.03em; color: #D9A441;
  border: 1px solid #4A3B22; border-radius: 4px; padding: 1px 5px; white-space: nowrap;
}
.unit-card-renta-row {
  display: flex; justify-content: space-between; gap: 8px; font-size: 10.5px; color: #6E8578;
}
.unit-card-renta-row b { font-size: 12.5px; color: #F2EDE1; font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
.unit-card-renta-row b.accent { color: #4FA391; }
.sale-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.unit-card-foot { display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; flex-wrap: wrap; gap: 4px; }
.gantt-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.gantt-row.clickable { cursor: pointer; border-radius: 8px; transition: background 0.15s; }
.gantt-row.clickable:hover { background: #172619; }

.gantt-panel { margin-bottom: 22px; }
.gantt { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.gantt-row { display: grid; grid-template-columns: 84px 1fr 92px; align-items: center; gap: 14px; }
.gantt-label { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #8FA398; }
.gantt-track { position: relative; height: 30px; background: #0F1B15; border-radius: 7px; overflow: hidden; border: 1px solid #1C2C22; }
.gantt-bar { position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; border-radius: 7px; transition: width 0.3s ease; }
.gantt-bar-budget { background: #22392C; }
.gantt-bar-real { height: 14px; top: 8px; left: 0; background: linear-gradient(90deg, #5FBEDB, #4FA391); border-radius: 5px; z-index: 2; }
.gantt-bar-real.over { background: linear-gradient(90deg, #D9A441, #8FB84E); }
.gantt-bar-value { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; padding-left: 8px; color: #C9D6CC; white-space: nowrap; }
.gantt-bar-real .gantt-bar-value { color: #0F1B15; font-weight: 500; }
.gantt-status { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; text-align: right; }
.gantt-empty { font-size: 12.5px; color: #8FA398; margin: 14px 2px 0; line-height: 1.5; }
.gantt-empty b { color: #D9A441; }
.gantt-reset { border: none; padding: 14px 0 0; margin: 4px 0 0; }
.gantt-reset .reset-btn { width: auto; padding: 8px 16px; }
.var-pos { color: #8FB84E; }
.var-neg { color: #C97656; }
.col-real { border-left: 1px dashed #22362A; }
.real-input { border-color: #3A5A63; }
.real-input:focus { border-color: #5FBEDB; }

.table-panel { padding: 22px 0 0; }
.table-head { padding: 0 24px; display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.month-tabs { display: flex; gap: 4px; background: #0F1B15; padding: 4px; border-radius: 9px; }
.month-tabs button { background: transparent; border: none; color: #8FA398; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 7px 10px; border-radius: 6px; cursor: pointer; }
.month-tabs button.active { background: #2C4234; color: #F2EDE1; }

.table-scroll { overflow-x: auto; margin-top: 18px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 1480px; }
thead th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #6E8578; padding: 10px 14px; border-bottom: 1px solid #22362A; font-weight: 500; position: sticky; top: 0; background: #16261C; }
th.num, td.num { text-align: right; font-family: 'IBM Plex Mono', monospace; min-width: 96px; }
.col-qreal { min-width: 60px; width: 60px; }
.col-qpresup { min-width: 64px; width: 64px; }
.col-precio { min-width: 128px; width: 128px; }
.col-um { min-width: 68px; width: 68px; }
tbody td { padding: 10px 14px; border-bottom: 1px solid #1C2C22; vertical-align: middle; }
tbody tr:hover { background: #172619; }
tbody tr.edited-row { background: rgba(217,164,65,0.07); }
.col-unit { width: 118px; }
.unit-tag { font-size: 10.5px; border: 1px solid; border-radius: 99px; padding: 3px 9px; white-space: nowrap; }
.col-line { min-width: 220px; }
.line-name { font-size: 11px; color: #8FA398; }
.ref-name { font-size: 13px; color: #F2EDE1; margin-top: 1px; }
.muted { color: #8FA398; }
.accent { color: #4FA391; font-weight: 500; }
.qty-input {
  width: 70px; background: #0F1B15; border: 1px solid #2C4234; color: #F2EDE1;
  font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; padding: 6px 8px; border-radius: 6px;
  text-align: right;
}
.qty-input:focus { outline: none; border-color: #D9A441; }
/* quitar flechas de incremento/decremento de los campos numéricos */
.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.qty-input[type="number"] { -moz-appearance: textfield; }
.price-input { width: 120px; }
.qreal-input { width: 52px; }
.qpresup-input { width: 56px; text-align: center; }
.real-ingresos-input { width: 130px; }
tfoot td { padding: 14px; font-family: 'IBM Plex Mono', monospace; border-top: 1px solid #33493A; font-weight: 500; }
tfoot tr td:first-child { font-family: 'Fraunces', serif; font-size: 13px; }

.app-footer { text-align: center; font-size: 11px; color: #56695C; margin-top: 28px; }

.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #1B2E23; border: 1px solid #4FA391; color: #F2EDE1; padding: 10px 18px;
  border-radius: 8px; font-size: 12.5px;
}

/* Dashboard toggle button */
.dashboard-btn {
  display: flex; align-items: center; gap: 10px; width: 100%;
  background: #182920; border: 1px solid #33493A; border-radius: 8px;
  padding: 11px 12px; color: #F2EDE1; font-family: inherit; font-size: 13px; font-weight: 500;
  cursor: pointer; margin-bottom: 14px; transition: background 0.15s, border-color 0.15s;
}
.dashboard-btn:hover { background: #1B2E23; border-color: #D9A441; }
.dashboard-btn.active { background: #24361D; border-color: #D9A441; color: #D9A441; }
.dashboard-btn-icon { font-size: 14px; }

/* Expand / venta a venta */
.col-expand { width: 26px; }
.col-delete { width: 32px; }
.delete-real-btn {
  background: transparent; border: none; color: #6E8578; cursor: pointer; font-size: 13px;
  width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.delete-real-btn:hover { background: rgba(181,88,58,0.15); color: #B5583A; }
.expand-toggle {
  background: transparent; border: none; color: #8FA398; cursor: pointer; font-size: 12px;
  width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.expand-toggle:hover { background: #1B2E23; color: #F2EDE1; }
.expand-toggle.has-log { color: #D9A441; }
.expand-toggle.open { color: #F2EDE1; background: #24361D; }

.sale-log-row td { background: #101D17; padding: 0 !important; border-bottom: 1px solid #22362A; }
.sale-log { padding: 14px 18px 16px; }
.sale-log-head {
  display: flex; justify-content: space-between; align-items: baseline; font-size: 12.5px;
  color: #F2EDE1; margin-bottom: 10px; font-weight: 500;
}
.sale-log-list { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 5px; }
.sale-log-list li {
  display: grid; grid-template-columns: 84px 92px 1fr 130px 24px; align-items: center; gap: 10px;
  font-size: 12.5px; background: #16261C; border: 1px solid #22362A; border-radius: 6px; padding: 7px 12px;
}
.sale-fecha { font-family: 'IBM Plex Mono', monospace; color: #8FA398; }
.sale-cantidad { color: #D9A441; font-weight: 500; }
.sale-cliente { color: #C9D6CC; }
.sale-linea { display: flex; align-items: center; gap: 6px; color: #C9D6CC; }
.sale-valor { text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500; }
.sale-remove {
  background: transparent; border: none; color: #8FA398; cursor: pointer; font-size: 12px;
  justify-self: end; border-radius: 4px; width: 20px; height: 20px;
}
.sale-remove:hover { color: #B5583A; background: #22362A; }
.sale-log-form { display: flex; gap: 8px; flex-wrap: wrap; }
.sale-input {
  background: #16261C; border: 1px solid #2C4234; color: #F2EDE1; border-radius: 6px;
  padding: 7px 9px; font-family: inherit; font-size: 12.5px;
}
.sale-input-qty { width: 90px; }
.sale-input-cliente { flex: 1; min-width: 160px; }
.sale-add-btn {
  background: #D9A441; border: none; color: #12201A; border-radius: 6px; font-weight: 600;
  font-size: 12.5px; padding: 7px 14px; cursor: pointer; white-space: nowrap;
}
.sale-add-btn:hover { background: #EBC067; }
.real-locked { display: inline-flex; align-items: center; gap: 6px; }

/* Tablero de control */
.kpi-registro-panel, .seguimiento-panel { margin-bottom: 22px; }
.kpi-registro-grid, .unit-funnel-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 4px;
}
.kpi-registro-card, .unit-funnel-card {
  background: #16261C; border: 1px solid #22362A; border-left-width: 3px; border-radius: 10px; padding: 14px;
}
.kpi-registro-title {
  display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #F2EDE1;
  margin-bottom: 10px;
}
.kpi-registro-field {
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  font-size: 12px; color: #B7C6BB; margin-bottom: 7px;
}
.kpi-registro-field input {
  width: 66px; background: #101D17; border: 1px solid #2C4234; color: #F2EDE1;
  border-radius: 6px; padding: 5px 8px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; text-align: right;
}
.funnel-total { margin-bottom: 22px; }
.funnel-total-stage { margin-bottom: 12px; }
.funnel-total-bar-wrap { height: 10px; background: #16261C; border-radius: 5px; overflow: hidden; margin-bottom: 5px; }
.funnel-total-bar { height: 100%; background: linear-gradient(90deg, #D9A441, #4FA391); border-radius: 5px; }
.funnel-total-label { display: flex; justify-content: space-between; font-size: 12.5px; color: #C9D6CC; }
.funnel-total-label b { color: #F2EDE1; font-family: 'IBM Plex Mono', monospace; }
.funnel-conv { font-size: 11px; color: #8FA398; }
.funnel-total-close {
  margin-top: 10px; font-size: 13px; color: #B7C6BB; padding-top: 12px; border-top: 1px solid #22362A;
}
.funnel-total-close b { color: #D9A441; }
.unit-funnel-row { display: grid; grid-template-columns: 62px 1fr 28px; align-items: center; gap: 8px; margin-bottom: 6px; }
.unit-funnel-stage { font-size: 11px; color: #8FA398; }
.unit-funnel-track { height: 7px; background: #101D17; border-radius: 4px; overflow: hidden; }
.unit-funnel-bar { height: 100%; border-radius: 4px; }
.unit-funnel-value { font-size: 11px; text-align: right; color: #C9D6CC; font-family: 'IBM Plex Mono', monospace; }
.unit-funnel-close { font-size: 11px; margin-top: 6px; }

/* Vendedores: metas y avance */
.vendedores-panel { margin-bottom: 22px; }
.vendedor-add-form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
.vendedor-select { cursor: pointer; }
.vendedor-select-inline { width: 100%; margin-bottom: 10px; }
.vendedores-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
.vendedor-card {
  background: #16261C; border: 1px solid #22362A; border-left-width: 3px; border-radius: 10px; padding: 14px;
}
.vendedor-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.vendedor-card-title { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: #F2EDE1; }
.vendedor-table { margin-top: 8px; }
.vendedor-table-head, .vendedor-row {
  display: grid; grid-template-columns: 78px 1fr 1fr 46px; align-items: center; gap: 6px;
}
.vendedor-table-head { font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: #8FA398; margin-bottom: 4px; }
.vendedor-row { margin-bottom: 5px; }
.vendedor-row-label { font-size: 11.5px; color: #B7C6BB; }
.vendedor-row input {
  width: 100%; background: #101D17; border: 1px solid #2C4234; color: #F2EDE1;
  border-radius: 6px; padding: 5px 7px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; text-align: right;
}
.vendedor-row span:last-child { text-align: right; font-size: 11.5px; }
.vendedor-card-foot { margin-top: 10px; padding-top: 10px; border-top: 1px solid #22362A; }

@media (max-width: 980px) {
  .sidebar { display: none; }
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .chart-grid { grid-template-columns: 1fr; }
  .main { padding: 20px; }
  .kpi-registro-grid, .unit-funnel-grid, .vendedores-grid { grid-template-columns: 1fr; }
  .sale-log-list li { grid-template-columns: 1fr; gap: 2px; }
  .sale-remove { justify-self: start; }
}

/* Botón de impresión por gráfico */
.print-btn {
  display: flex; align-items: center; gap: 6px; background: #16261C; border: 1px solid #2C4234;
  color: #C9D6CC; font-family: inherit; font-size: 12px; font-weight: 500; border-radius: 7px;
  padding: 7px 12px; cursor: pointer; white-space: nowrap; transition: background 0.15s, border-color 0.15s;
}
.print-btn:hover { background: #1B2E23; border-color: #D9A441; color: #F2EDE1; }

@media print {
  .no-print, .sidebar, .dashboard-btn, .print-btn, .reset-btn, .app-footer, .toast { display: none !important; }
  body * { visibility: hidden; }
  .print-active, .print-active * { visibility: visible; }
  .print-active {
    position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 16px;
    background: #fff !important; border: none !important; box-shadow: none !important;
  }
  .print-active, .print-active * { color: #111 !important; }
  .print-active .gantt-bar-budget { background: #ddd !important; }
  .presentation-overlay, .presentation-overlay * { visibility: visible !important; }
  .presentation-overlay { position: fixed !important; background: #fff !important; }
  .presentation-overlay, .presentation-overlay .pres-slide, .presentation-overlay .pres-slide * { color: #111 !important; }
}

/* Botón "Presentación" en el encabezado del Tablero de control */
.tablero-title-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.tablero-title-row h1 { margin: 0; }
.presentation-btn {
  display: flex; align-items: center; gap: 7px; background: #D9A441; border: none; color: #12201A;
  font-family: inherit; font-weight: 600; font-size: 13px; border-radius: 8px; padding: 9px 16px;
  cursor: pointer; transition: background 0.15s;
}
.presentation-btn:hover { background: #EBC067; }

/* Overlay de presentación ejecutiva */
.presentation-overlay {
  position: fixed; inset: 0; background: #0D1712; z-index: 1000;
  display: flex; flex-direction: column; font-family: 'IBM Plex Sans', sans-serif;
}
.presentation-topbar {
  display: flex; align-items: center; justify-content: space-between; padding: 14px 24px;
  border-bottom: 1px solid #22362A; color: #8FA398; font-size: 12.5px;
}
.presentation-actions { display: flex; gap: 10px; }
.presentation-actions button {
  background: #16261C; border: 1px solid #2C4234; color: #C9D6CC; font-family: inherit;
  font-size: 12.5px; border-radius: 7px; padding: 7px 14px; cursor: pointer;
}
.presentation-actions button:hover { background: #1B2E23; border-color: #D9A441; color: #F2EDE1; }
.presentation-slide-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 32px;
}
.pres-slide {
  width: 100%; max-width: 920px; background: #12201A; border: 1px solid #22362A; border-radius: 16px;
  padding: 48px 56px; color: #F2EDE1; min-height: 480px; display: flex; flex-direction: column; justify-content: center;
}
.pres-cover { align-items: flex-start; gap: 10px; }
.pres-eyebrow { font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: #D9A441; margin: 0; }
.pres-cover h1 { font-family: 'Fraunces', serif; font-size: 44px; margin: 4px 0; }
.pres-cover-sub { font-family: 'Fraunces', serif; font-weight: 400; font-size: 20px; color: #C9D6CC; margin: 0 0 24px; }
.pres-cover-meta { display: flex; gap: 10px; color: #8FA398; font-size: 13px; }
.pres-title { font-family: 'Fraunces', serif; font-size: 26px; margin: 0 0 28px; }
.pres-kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.pres-kpi-card {
  background: #16261C; border: 1px solid #22362A; border-radius: 12px; padding: 20px;
  display: flex; flex-direction: column; gap: 8px;
}
.pres-kpi-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color: #8FA398; }
.pres-kpi-value { font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 600; }
.pres-kpi-value.accent { color: #4FA391; }
.pres-note { margin-top: 22px; font-size: 13.5px; color: #C9D6CC; line-height: 1.6; }
.pres-note b { color: #D9A441; }
.pres-empty { color: #8FA398; font-size: 14px; }
.pres-bars { display: flex; flex-direction: column; gap: 14px; }
.pres-bar-row { display: grid; grid-template-columns: 130px 1fr 170px; align-items: center; gap: 14px; }
.pres-bar-label { font-size: 13px; color: #C9D6CC; }
.pres-bar-track { position: relative; height: 20px; background: #16261C; border-radius: 6px; overflow: hidden; }
.pres-bar-budget { position: absolute; inset: 0; background: #2C4234; border-radius: 6px; }
.pres-bar-real { position: absolute; top: 0; left: 0; bottom: 0; background: #D9A441; border-radius: 6px; }
.pres-bar-value { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #C9D6CC; text-align: right; }
.pres-legend { display: flex; gap: 20px; margin-top: 20px; font-size: 12px; color: #8FA398; }
.pres-legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; }
.pres-legend-dot.budget { background: #2C4234; }
.pres-legend-dot.real { background: #D9A441; }
.pres-funnel-stage { margin-bottom: 16px; }
.pres-funnel-bar-wrap { height: 14px; background: #16261C; border-radius: 7px; overflow: hidden; margin-bottom: 6px; }
.pres-funnel-bar { height: 100%; background: linear-gradient(90deg, #D9A441, #4FA391); border-radius: 7px; }
.pres-funnel-label { display: flex; justify-content: space-between; font-size: 14px; color: #C9D6CC; }
.pres-funnel-label b { font-family: 'IBM Plex Mono', monospace; color: #F2EDE1; }
.pres-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.pres-table th { text-align: left; font-size: 11px; text-transform: uppercase; color: #8FA398; padding: 8px 10px; border-bottom: 1px solid #22362A; }
.pres-table td { padding: 10px; border-bottom: 1px solid #22362A; }
.pres-table th.num, .pres-table td.num { text-align: right; font-family: 'IBM Plex Mono', monospace; }
.pres-table td b.pos { color: #4FA391; }
.pres-conclusions { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 14px; font-size: 14.5px; line-height: 1.6; }
.pres-conclusions b { color: #D9A441; }
.presentation-nav {
  display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;
  border-top: 1px solid #22362A;
}
.presentation-nav button {
  background: #16261C; border: 1px solid #2C4234; color: #C9D6CC; font-family: inherit;
  font-size: 13px; border-radius: 8px; padding: 9px 16px; cursor: pointer;
}
.presentation-nav button:hover:not(:disabled) { background: #1B2E23; border-color: #D9A441; color: #F2EDE1; }
.presentation-nav button:disabled { opacity: 0.35; cursor: not-allowed; }
.presentation-dots { display: flex; gap: 8px; }
.pres-dot { width: 9px; height: 9px; padding: 0; border-radius: 50%; background: #2C4234; border: none; cursor: pointer; }
.pres-dot.active { background: #D9A441; width: 22px; border-radius: 5px; }
`;
