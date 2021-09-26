// задаем точность для чисел с плавающей точкой
// эта точность определяет с какой точностью будет выполнять о-ции GPU
// lowp (-2, 2),  mediump, highp
precision mediump float;

void main(){
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}