import { ShaderSource } from "./shader";

// layout(location = 0) in vec4 aPosition;
// layout(location = 1) in vec2 aTexCoord;
// layout(location = 2) in vec4 color;

//  gl_Position = uMVP * aPosition;
export const vsSource = ShaderSource.vertex`
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
`;

export const fsSource = ShaderSource.fragment`
  precision mediump float;

  in vec2 vTexCoord;
  in vec4 vColor;

  out vec4 fragColor;
  uniform sampler2D uSampler;

  void main() {
    fragColor = vColor;
    fragColor = texture(uSampler, vTexCoord);
  }
`;
