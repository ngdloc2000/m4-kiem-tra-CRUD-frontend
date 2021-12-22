showList()

function getCity(city) {
    return `<tr>
                <td><a href="" onclick="detail(${city.id})">${city.name}</a></td>
                <td>${city.national.name}</td>
                <td><button onclick="deleteCity(${city.id})">Delete</button></td>
                <td><button onclick="showEdit(${city.id})">Update</button></td>
            </tr>`;
}

function showList() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/cities`,
        success: function (city) {
            let content = "";
            for (let i = 0; i < city.length; i++) {
                content += getCity(city[i]);
            }
            document.getElementById("showAll").innerHTML = content;
        }
    });
}

function deleteCity(cityId) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/cities/${cityId}`,
        success: function () {
            showList();
        }
    });
    event.preventDefault();
}

function showEdit(cityId) {
    $('#formEdit').modal('show');
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/cities/${cityId}`,
        success: function (data) {
            $('#namecity1').val(data.name);
            $('#description1').val(data.description);
            $('#gdp1').val(data.gdp);
            $('#area1').val(data.area);
            $('#population1').val(data.population);
            $('#idcity1').val(data.id);
            $.ajax({
                type: "GET",
                url: `http://localhost:8080/nationals`,
                success: function (data) {
                    let listNational = [];
                    listNational = data;
                    let nationalSelected = document.getElementById("national1");
                    listNational.forEach(function (option) {
                        var opt = document.createElement('option');
                        opt.value = option.id;
                        opt.innerHTML = option.name;
                        nationalSelected.appendChild(opt);
                    })
                }
            })
        }
    })
    event.preventDefault();
}

function updateCity() {
    let name = $('#namecity1').val();
    let description = $('#description1').val();
    let gdp = $('#gdp1').val();
    let population = $('#population1').val();
    let national_id = $('#national1').val();
    let area = $('#area1').val();
    let idcity = $('#idcity1').val();
    let data = {
        id: idcity,
        name: name,
        description: description,
        area: area,
        gdp: gdp,
        population: population,
        national: {
            id: national_id
        }
    }
    $.ajax({
        type: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        url: `http://localhost:8080/cities/` + idcity,
        data: JSON.stringify(data),
        success: function (data) {
            showList();
            $('#formEdit').modal('hide');
        }
    })
    event.preventDefault();
}

function showCreate() {
    $('#formCreate').modal('show');
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/nationals`,
        success: function (data) {
            let listNational = [];
            listNational = data;
            let nationalSelect = document.getElementById("national");
            if (nationalSelect.childNodes.length > 1) {

            } else {
                listNational.forEach(function (option) {
                    var opt = document.createElement('option');
                    opt.value = option.id;
                    opt.innerHTML = option.name;
                    nationalSelect.appendChild(opt);
                })
            }
        }
    })
    event.preventDefault();
}

function createCity() {
    let name = $('#namecity').val();
    let description = $('#description').val();
    let gdp = $('#gdp').val();
    let population = $('#population').val();
    let national_id = $('#national').val();
    let area = $('#area').val();
    let data = {
        name: name,
        description: description,
        area: area,
        gdp: gdp,
        population: population,
        national: {
            id: national_id
        }
    }
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        url: `http://localhost:8080/cities`,
        data: JSON.stringify(data),
        success: function (data) {
            showList();
            $('#formCreate').modal('hide');
        }
    })
    event.preventDefault();
}

function detail(cityId) {
    $('#formDetail').modal('show');
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/cities/${cityId}`,
        success: function (data) {
            $('#namecity2').val(data.name);
            $('#description2').val(data.description);
            $('#gdp2').val(data.gdp);
            $('#area2').val(data.area);
            $('#population2').val(data.population);
            $('#national2').val(data.national.name);
        }
    })
}

function closeDetailForm() {
    $('#formDetail').modal('hide');
}

function gdpOfEachCity() {
    let dataPoints = [];
    let chart;
    $.getJSON("http://localhost:8080/cities",
        function (data) {
            $.each(data, function (key, value) {
                dataPoints.push({y: parseInt(value.gdp), label: value.name});
            });
            chart = new CanvasJS.Chart("gdpOfEachCity", {
                data: [{
                    type: "column",
                    dataPoints: dataPoints,
                }]
            });
            chart.render();
        });
}

function gdpOfEachCityPie() {
    let dataPoints = [];
    let chart;
    $.getJSON("http://localhost:8080/cities/gdpPieChart",
        function (data) {
            $.each(data, function (key, value) {
                dataPoints.push({y: value.result, label: value.name});
            });
            chart = new CanvasJS.Chart("gdpOfEachCity", {
                animationEnabled: true,
                data: [{
                    type: "column",
                    startAngle: 240,
                    yValueFormatString: "##0.00\"%\"",
                    indexLabel: "{label} {y}",
                    dataPoints: dataPoints,
                }]
            });
            chart.render();
        });

}

