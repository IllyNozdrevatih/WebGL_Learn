// задаем точность для чисел с плавающей точкой
// эта точность определяет с какой точностью будет выполнять о-ции GPU
// lowp (-2, 2),  mediump, highp
precision mediump float;
varying vec3 vColor;

void main(void){
    gl_FragColor = vec4(vColor, 1.);
}