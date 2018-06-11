$(function () {

    $('#country_select').on('change', function() {
        var country_id = $(this).val();
        $('#city_select').load(country_id + '-cities.html'); 
    });

    $('#city_select').on('change', function() {
        var city_id = $(this).val();
        var api_url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city_id + ',uk&units=metric&appid=8e23168614bd398a3314d87d649cfa82';

        setInterval(render(api_url), 15000);
    });

    function render(api_url) {
        $.ajax({
            url: api_url,
            dataType: 'json',
            type: 'get',
            
            success: function(response) {
                $('#response').html('');
                      
                transformDate = currentDate(response.dt);
                transformTemp = Math.ceil(response.main.temp);
                transformWind = milesPerHour(response.wind.speed);
                transformDire = convertDeg(response.wind.deg);
                transformIcon = displayIcon(response.weather[0].icon);
                                                           
                src = '<table><thead><tr>';
                src += '<th>CITY</th>';
                src += '<th>DATE</th>';
                src += '<th>CONDITIONS</th>';
                src += '<th>TEMP.</th>';
                src += '<th>WIND SPEED</th>';
                src += '<th>WIND DIRECTION</th>';
                src += '<th>ICON</th>';
                src += '</tr></thead>';
                src += '<tbody>';
                
                src += '<tr>';
                src += '<td>' + response.name + '</td>';
                src += '<td>' + transformDate + '</td>';
                src += '<td>' + response.weather[0].main + '</td>';
                src += '<td>' + transformTemp + '&deg;C</td>';
                src += '<td>' + transformWind + ' mph</td>';
                src += '<td>' + transformDire + '</td>';
                src += '<td>' + transformIcon + '</td>';
                src += '</tr>';
                
                src += '</tbody></table>';
                      
                $('#response').append(src);
                      
                if ($('#response').attr("hidden")) {
                    $('#response').show();
                }   				
            },

            error: function(jqxhr, status, response) {
                $('#response').html('<p>An error has occured: ' + jqxhr.status + ' - ' + jqxhr.statusText + '</p>');
            }
        });
    }

    function currentDate(objDate) {
        currDate = new Date(objDate*1000);
        var dd = currDate.getDate();
        var MM = currDate.getMonth();
        var yyyy = currDate.getFullYear();
        var currentDate = dd + '-' + (MM+1) + '-' + yyyy;

        return currentDate;
    }
    
    function milesPerHour(objMpS) {
        var transformMpS = objMpS * 2.2369;
        var roundMpS = Math.round(transformMpS);

        return roundMpS;
    }

    function convertDeg(degree) {
        var val = Math.floor(degree/45);
        var dir_arr = ["Northerly", "North Easterly", "Easterly", "South Easterly", "Southerly", "South Westerly", "Westerly", "North Westerly"];
        if (val >=8) val = 0;

        return dir_arr[val];
    }
   
    function displayIcon(iconID) {
        var iconURL = 'http://openweathermap.org/img/w/' + iconID + '.png';
        var imgSrcURL = '<img src="' + iconURL + '"/>';

        return imgSrcURL;
    }
    
});