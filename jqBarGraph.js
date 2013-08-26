/**
 * jqBarGraph - jQuery plugin
 * @version: 1.1 (2011/04/03)
 * @requires jQuery v1.2.2 or later 
 * @author Ivan Lazarevic
 * Examples and documentation at: http://www.workshop.rs/jqbargraph/
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * @param data: arrayOfData // array of data for your graph
 * @param title: false // title of your graph, accept HTML
 * @param barSpace: 10 // this is default space between bars in pixels
 * @param width: 400 // default width of your graph ghhjgjhg
 * @param height: 200 //default height of your graph
 * @param color: '#000000' // if you don't send colors for your data this will be default bars color
 * @param colors: false // array of colors that will be used for your bars and legends
 * @param lbl: '' // if there is no label in your array
 * @param sort: false // sort your data before displaying graph, you can sort as 'asc' or 'desc'
 * @param position: 'bottom' // position of your bars, can be 'bottom' or 'top'. 'top' doesn't work for multi type
 * @param prefix: '' // text that will be shown before every label
 * @param postfix: '' // text that will be shown after every label
 * @param animate: true // if you don't need animated appereance change to false
 * @param speed: 2 // speed of animation in seconds
 * @param legendWidth: 100 // width of your legend box
 * @param legend: false // if you want legend change to true
 * @param legends: false // array for legend. for simple graph type legend will be extracted from labels if you don't set this
 * @param type: false // for multi array data default graph type is stacked, you can change to 'multi' for multi bar type
 * @param showValues: true // you can use this for multi and stacked type and it will show values of every bar part
 * @param showValuesColor: '#fff' // color of font for values 
 * @param valueStyle: null // a function which receives the value and returns whatever string it wants e.g. 1000 -> 1,000

 * @example  $('#divForGraph').jqBarGraph({ data: arrayOfData });  
  
**/

(function ($) {
    var opts = [],
        level = [];

    $.fn.jqBarGraph = $.fn.jqbargraph = function (options) {

        var defaults = {
            barSpace: 10,
            width: 400,
            height: 300,
            color: '#000000',
            colors: false,
            lbl: '',
            sort: false, // 'asc' or 'desc'
            position: 'bottom', // or 'top' doesn't work for multi type
            prefix: '',
            postfix: '',
            valueStyle: null,
            animate: true,
            speed: 1.5,
            legendWidth: 100,
            legend: false,
            legends: false,
            type: false, // or 'multi'
            showValues: true,
            showValuesColor: '#fff',
            title: false
        },

        unique = '', // unique identifier based on data value and graph holder

        init = function (el) {

            opts[el.id] = $.extend({}, defaults, options);
            $(el).css({
                'width': opts[el.id].width,
                'height': opts[el.id].height,
                'position': 'relative',
                'text-align': 'center'
            });
            doGraph(el);

        },

        // sum of array elements
        sum = function (ar) {

            var total = 0,
                val;

            for (val in ar) {
                total += ar[val];
            }

            return total.toFixed(2);

        },

        // count max value of array
        max = function (ar) {

            var maxvalue = 0,
                val;

            for (val in ar) {
                value = ar[val][0];
                if (value instanceof Array) {
                    value = sum(value);
                }
                if (parseFloat(value) > parseFloat(maxvalue)) {
                    maxvalue = value;
                }
            }

            return maxvalue;

        },

        // max value of multi array
        maxMulti = function (ar) {
            var maxvalue = 0,
                maxvalue2 = 0,
                val,
                val2;

            for (val in ar) {
                ar2 = ar[val][0];

                for (val2 in ar2) {
                    if (ar2[val2] > maxvalue2) {
                        maxvalue2 = ar2[val2];
                    }
                }

                if (maxvalue2 > maxvalue) {
                    maxvalue = maxvalue2;
                }
            }

            return maxvalue;

        },

        doGraph = function (el) {

            //check if array is bad or empty
            if (opts[el.id].data === undefined) {
                $(el).html('There is not enought data for graph');
                return;
            }

            var arr = opts[el.id],
                data = arr.data,
                legend = '',
                prefix = arr.prefix,
                postfix = arr.postfix,
                valueStyle = arr.valueStyle,
                styledValue = '',
                space = arr.barSpace, //space between bars
                legendWidth = arr.legend ? arr.legendWidth : 0, //width of legend box
                fieldWidth = ($(el).width() - legendWidth) / data.length, //width of bar
                totalHeight = $(el).height(), //total height of graph box
                leg = [], //legends array
                maximum = max(data), //max value in data, I use this to calculate height of bar
                colPosition = 0, // for printing colors on simple bar graph
                val,
                valueData,
                lbl,
                color,
                totalHeightBar,
                fieldHeight,
                i,
                maxe,
                heig,
                wid,
                sv, // value with prefix and sufix
                fs, // font-size
                o,
                l;

            //sorting ascending or descending
            if (arr.sort === 'asc') {
                data.sort(sortNumberAsc);
            }
            if (arr.sort === 'desc') {
                data.sort(sortNumberDesc);
            }

            for (val in data) {

                valueData = data[val][0];
                if (valueData instanceof Array) {
                    value = sum(valueData);
                } else {
                    value = valueData;
                }
                
                styledValue = value;
                
                if ( typeOf( valueStyle ) === 'function' ) {
                    styledValue = valueStyle( value );
                }

                lbl = data[val][1];
                color = data[val][2];
                unique = val + el.id; //unique identifier

                if (!color && !arr.colors) {
                    color = arr.color;
                }

                if (arr.colors && !color) {
                    colorsCounter = arr.colors.length;
                    if (colorsCounter === colPosition) {
                        colPosition = 0;
                    }
                    color = arr.colors[colPosition];
                    colPosition++;
                }

                if (arr.type === 'multi') {
                    color = 'none';
                }

                if (!lbl) {
                    lbl = arr.lbl;
                }

                out = "<div class='graphField" + el.id + "' id='graphField" + unique + "' style='position: absolute'>";
                out += "<div class='graphValue" + el.id + "' id='graphValue" + unique + "'>" + prefix + styledValue + postfix + "</div>";

                out += "<div class='graphBar" + el.id + "' id='graphFieldBar" + unique + "' style='background-color:" + color + ";position: relative; overflow: hidden;'></div>";

                // if there is no legend or exist legends display lbl at the bottom
                if (!arr.legend || arr.legends) {
                    out += "<div class='graphLabel" + el.id + "' id='graphLabel" + unique + "'>" + lbl + "</div>";
                }

                out += "</div>";

                $(el).append(out);

                //size of bar
                totalHeightBar = totalHeight - $('.graphLabel' + el.id).height() - $('.graphValue' + el.id).height();
                fieldHeight = (totalHeightBar * value) / maximum;
                $('#graphField' + unique).css({
                    'left': (fieldWidth) * val,
                    'width': fieldWidth - space,
                    'margin-left': space
                });

                // multi array
                if (valueData instanceof Array) {

                    if (arr.type === 'multi') {
                        maxe = maxMulti(data);
                        totalHeightBar = fieldHeight = totalHeight - $('.graphLabel' + el.id).height();
                        $('.graphValue' + el.id).remove();
                    } else {
                        maxe = maximum;
                    }

                    for (i in valueData) {
                        heig = totalHeightBar * valueData[i] / maxe;
                        wid = parseInt((fieldWidth - space) / valueData.length);
                        sv = ''; // show values
                        fs = 0; // font size
                        if (arr.showValues) {
                            sv = arr.prefix + valueData[i] + arr.postfix;
                            fs = 12; // font-size is 0 if showValues = false
                        }
                        o = "<div class='subBars" + el.id + "' style='height:" + heig + "px; background-color: " + arr.colors[i] + "; left:" + wid * i + "px; color:" + arr.showValuesColor + "; font-size:" + fs + "px' >" + sv + "</div>";
                        $('#graphFieldBar' + unique).prepend(o);
                    }
                }

                if (arr.type === 'multi') {
                    $('.subBars' + el.id).css({
                        'width': wid,
                        'position': 'absolute',
                        'bottom': 0
                    });
                }

                //position of bars
                if (arr.position === 'bottom') {
                    $('.graphField' + el.id).css('bottom', 0);
                }

                //creating legend array from lbl if there is no legends param
                if (!arr.legends) {
                    leg.push([color, lbl, el.id, unique]);
                }

                // animated apearing
                if (arr.animate) {
                    $('#graphFieldBar' + unique).css({
                        'height': 0
                    });
                    $('#graphFieldBar' + unique).animate({
                        'height': fieldHeight
                    }, arr.speed * 1000);
                } else {
                    $('#graphFieldBar' + unique).css({
                        'height': fieldHeight
                    });
                }

            }

            //creating legend array from legends param
            for (l in arr.legends) {
                leg.push([arr.colors[l], arr.legends[l], el.id, l]);
            }

            createLegend(leg); // create legend from array

            //position of legend
            if (arr.legend) {
                $(el).append("<div id='legendHolder" + unique + "'></div>");
                $('#legendHolder' + unique).css({
                    'width': legendWidth,
                    'float': 'right',
                    'text-align': 'left'
                });
                $('#legendHolder' + unique).append(legend);
                $('.legendBar' + el.id).css({
                    'float': 'left',
                    'margin': 3,
                    'height': 12,
                    'width': 20,
                    'font-size': 0
                });
            }

            //position of title
            if (arr.title) {
                $(el).wrap("<div id='graphHolder" + unique + "'></div>");
                $('#graphHolder' + unique).prepend(arr.title).css({
                    'width': arr.width + 'px',
                    'text-align': 'center'
                });
            }

        },

        //creating legend from array
        createLegend = function (legendArr) {
            legend = '';
            for (var val in legendArr) {
                legend += "<div id='legend" + legendArr[val][3] + "' style='overflow: hidden; zoom: 1;'>";
                legend += "<div class='legendBar" + legendArr[val][2] + "' id='legendColor" + legendArr[val][3] + "' style='background-color:" + legendArr[val][0] + "'></div>";
                legend += "<div class='legendLabel" + legendArr[val][2] + "' id='graphLabel" + unique + "'>" + legendArr[val][1] + "</div>";
                legend += "</div>";
            }
        },

        //sorting functions
        sortNumberAsc = function(a, b) {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
        },

        sortNumberDesc = function(a, b) {
            if (a[0] > b[0]) return -1;
            if (a[0] < b[0]) return 1;
            return 0;
        };

        this.each( 
            function() {
                init(this);
            }
        );

    };

})(jQuery);
