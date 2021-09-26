// двумерный вектор состоящий из числел с плавающей запятой
// атрибут - способ передачи данных в вершинный шейдер (vertexPosition)
// vertexPosition - двумерный вектор корый передает координаты в X, Y
// vertexPosition - как переменная содержащая данные
attribute vec2 vertexPosition;

void main(){
    // gl_Position - встроенная выходная переменная
    gl_Position = vec4(vertexPosition, 0, 1);
}
