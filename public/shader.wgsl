struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) color: vec3f,
};

@group(0) @binding(0) var<uniform> mvp: mat4x4f;

@vertex
fn vs_main(
    @location(0) pos: vec3f,
    @location(1) color: vec3f
) -> VertexOutput {
    var out: VertexOutput;
    out.pos = mvp * vec4f(pos, 1.0);
    out.color = color;
    return out;
}

@fragment
fn fs_main(@location(0) color: vec3f) -> @location(0) vec4f {
    return vec4f(color, 1.0);
}
