#type vertex

in vec2 aPosition;
in vec2 aTexCoord;
in vec4 color;
in vec2 offset;

uniform mat4 uMVP;
uniform mat4 uTransform;

out vec2 vTexCoord;
out vec4 vColor;

void main() {
  gl_Position = uMVP * uTransform * vec4(aPosition + offset, 0.0, 1.0);

  vTexCoord = aTexCoord;
  vColor = color;
}

#type fragment

precision mediump float;

in vec2 vTexCoord;
in vec4 vColor;

out vec4 fragColor;
uniform sampler2D uSampler;

void main() {
  fragColor = vColor;
  fragColor = texture(uSampler, vTexCoord);
}
