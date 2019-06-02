// Mi código JavaScript relativo a la sección Ventas:

// Objeto de Vue:
var salesApp = new Vue({
	el: '#sales',
	data: {
		cars_all 			: [], // Array que contendrá la lista original de autos.
		cars_filtered		: [], // Array que contendrá la lista de autos filtrados.
		currency			: "USD", // Variable que indica la moneda seleccionada.
		change_rate 		: 0,
		brands				: [],
		brand_selected		: "",
		models				: [],
		model_selected		: "",
		years				: [],
		year_selected		: "",
		status_selected		: "",
	},
	filters: {
		// Documentación de Vue.js sobre Filtros:
		// https://vuejs.org/v2/guide/syntax.html#Filters
		thousands: function (value) {
			// Documentación de JavaScript sobre toLocaleString:
			// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
			return parseInt(value).toLocaleString('es-UY');
		}
	}
});


// Carga de los Años:
for (var i = 2018; i >= 1900; i--) {
	salesApp.years.push(i);
}


// Carga de Tipo de Cambio:
// Sólo se realiza una vez al cargar la página.
$.ajax({
	url: "https://ha.edu.uy/api/rates",
	success : function (data) {

		salesApp.change_rate = data.uyu;

		// Carga de Autos:
		// Esto se hace después de haber cargado el Tipo de Cambio para poder
		// convertir el precio de dólares a pesos.
		$.ajax({
			url: "https://ha.edu.uy/api/cars",
			success : function (data) {
				salesApp.cars_filtered = data;
				salesApp.cars_all = data;
				salesApp.cars_all.forEach(function(car) {
					// A cada auto se le asigna su precio en pesos:
					car.price_uyu = car.price_usd * salesApp.change_rate;
				});
				$(".alert-warning").removeClass('hidden');
			}
		}); // End - Ajax de Autos

	}
}); // End - Ajax de Tipo de Cambio


// Carga de Marcas:
// Sólo se realiza una vez al cargar la página.
$.ajax({
	url: "https://ha.edu.uy/api/brands",
	success : function (data) {
		salesApp.brands = data;
	}
});


// Detección del evento "change" en el select de marcas.
// Cada vez que se cambia una marca, actualiza la lista de modelos.
$("#select-brand").on("change", function() {

	var url = "https://ha.edu.uy/api/models?brand=" + salesApp.brand_selected;

	$.ajax({
		url: url,
		success : function (data) {
			salesApp.models 			= data;
			salesApp.model_selected 	= "";
		}
	});

});


// Filtro de Autos:
$("#btn-filter").on("click", function() {

	salesApp.cars_filtered = []; // Array vacío (sin autos).

	var year 		= salesApp.year_selected; // Shortcut.
	var brand 		= salesApp.brand_selected; // Shortcut.
	var model 		= salesApp.model_selected; // Shortcut.
	var status 		= salesApp.status_selected; // Shortcut.

	salesApp.cars_all.forEach(function(car) {

		console.log("AUTO con Año: " + car.year + ", Marca: " + car.brand + ", Modelo: " + car.model + ".");

		var yearFilterPassed 		= car.year == year || year == undefined || year == "";
		var brandFilterPassed 		= car.brand == brand || brand == undefined || brand == "";
		var modelFilterPassed 		= car.model == model || model == undefined || model == "";
		var statusFilterPassed 		= car.status == status || status == undefined || status == "";

		if (yearFilterPassed && brandFilterPassed && modelFilterPassed && statusFilterPassed) {
			salesApp.cars_filtered.push(car);
		}

	});

});


// Botón Tipo de Cambio:
$("#btn-currency").on("click", function() {

	if (salesApp.currency == "USD") {
		salesApp.currency = "UYU";
	} else {
		salesApp.currency = "USD";
	}

});
