var InitWebGl = function () {
    var VSText, FSText;
    loadTextResources('/shaders/vertexShader.glsl')
    .then(function (result) {
        VSText = result
        return loadTextResources('/shaders/fragmentShader.glsl')
    })
    .then(function (result) {
        FSText = result
        return StartWebGL(VSText, FSText)
    })
    .catch(function (err) {
        console.log(err)
    })
}

var StartWebGL = function (vertexShaderText, fragmentShaderText) {
    const canvas = document.querySelector('#example-canvas')
    const gl = canvas.getContext('webgl')

    canvas.height = gl.canvas.clientHeight;
    canvas.width = gl.canvas.clientWidth;


    // createShader - возвращает щейдер соотвецтвующего типа
    // gl.VERTEX_SHADER, gl.FRAGMENT_SHADER - тип шейдера
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    // помещаем в шейдер код соотвецтвующего шейдера
    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    // компилируем код шейдера с которым будет работеть программа
    gl.compileShader(vertexShader)
    // проверка на компиляцию шейдера
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert('Error compiling shader!');
        console.error('Shader error info: ', gl.getShaderInfoLog(vertexShader))
    }

    gl.compileShader(fragmentShader)

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert('Error compiling shader!');
        console.error('Shader error info: ', gl.getShaderInfoLog(fragmentShader))
    }

    // создание программы котора будет использовать наши шейдеры
    var program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    // связыват шейдеры с программой
    gl.linkProgram(program)
    gl.validateProgram(program)

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validation program: ', gl.getProgramInfoLog(program))
        return;
    }

    gl.useProgram(program)

    /*========== Defining and storing the geometry ==========*/

    var vertexArray = [
      // x,  y,  z
        -0.5,0.5,0.0, // 0
        -0.5,-0.5,0.0, // 1
        0.5,-0.5,0.0, // 2
        0.5,0.5,0.0 // 3
    ]

    var indices = [
        3,2,1, // 1 - й триугольник
        3,1,0 // 2 - й триугольник
    ];

    var colors = [0,0,1, 1,0,0, 0,1,0, 1,0,1];


    // буфер содержащий данные о вершинах
    var vertexBuffer = gl.createBuffer()
    // связывем буфер с точкой связи
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Create an empty buffer object to store Index buffer
    var Index_Buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Create an empty buffer object and store color data
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    /* ======= Associating shaders to buffer objects =======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

    // помещаем точки в буфер
    // для webgl нужны числа определенного типа
    // в нашем случае - attribute vec2 vertexPosition
    // двумерный буфер с плавающей точкой
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

    // передаем данные из буфера с шейдер

    // получаем ссылку на атрибут
    var positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition')

    gl.vertexAttribPointer(
        positionAttribLocation, // ссылка на атрибут
        3, // кол-во эл-тов на одну итерацию ( 2 - коориднаты )
        gl.FLOAT, // тип данных
        false, // нормализация
        // кол-во эл-тов массива на одну верщину ( 2 - координацты вершины ).
        // если бы передавался бы цвет было бы 5 ( x,y,r,g,b )
        0 * Float32Array.BYTES_PER_ELEMENT,
        // кол-во эт-во пропущеных в каждой итерации
        // если бы нужно получить цвет
        // мы пропустили бы первые 2 первых эт-та
        0    * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(positionAttribLocation)


    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(program, "color");

    // point attribute to the сolor buffer object
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;

    // enable the color attribute
    gl.enableVertexAttribArray(color);

    // установим свет после очистки буфера



    /*============Drawing the Quad====================*/

    gl.clearColor(0.75, 0.9, 1.0, 1.0)

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT)

    // 1 - й переметр.
    // с помощью каких приметивов будет отрисовано изображение
    // точка, линии, замкнутые линии, триугольники
    // 2 - й. стартовый индекс
    // 3 - й. кол-во вершин нужное для отрисовки.

    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
    // gl.drawArrays(gl.TRIANGLES, 0, 3)
}

document.addEventListener('DOMContentLoaded', function () {
    InitWebGl()
})