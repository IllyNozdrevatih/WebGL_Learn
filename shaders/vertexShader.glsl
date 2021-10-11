// двумерный вектор состоящий из числел с плавающей запятой
// атрибут - способ передачи данных в вершинный шейдер (vertexPosition)
// vertexPosition - двумерный вектор корый передает координаты в X, Y
// vertexPosition - как переменная содержащая данные
attribute vec3 vertexPosition;
attribute vec3 color;
varying vec3 vColor;

void main(void){
    // gl_Position - встроенная выходная переменная
    gl_Position = vec4(vertexPosition, 1.0);
    vColor = color;
}
