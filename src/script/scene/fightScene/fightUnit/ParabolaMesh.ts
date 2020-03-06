export default class ParabolaMesh {

  /**
   * 
   * @param long    X轴方向
   * @param width   Z轴方向
   * @param longSlices    长切分
   * @param widhtSlices   宽切分
   */
  public static createParabol(long: number = 10, width: number = 10, longSlices: number = 10, widhtSlices: number = 10): Laya.Mesh {

    const vertexCount = (longSlices + 1) * (widhtSlices + 1);
    const indexCount = longSlices * widhtSlices * 2 * 3;
    const indices = new Uint16Array(indexCount);
    const vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
    const vertexFloatStride = vertexDeclaration.vertexStride / 4;
    const vertices = new Float32Array(vertexCount * vertexFloatStride);
    const halfLong = long / 2;
    const halfWidth = width / 2;
    const stacksLong = long / longSlices;
    const slicesWidth = width / widhtSlices;
    
    let verticeCount = 0;
    for (let i = 0; i <= widhtSlices; i++) {
      for (let j = 0; j <= longSlices; j++) {
        vertices[verticeCount++] = j * stacksLong - halfLong + long / 2; // + 0.5 * j;  // long / 2 将原始左上角的点平移到（0，0）点
        vertices[verticeCount++] = Math.sin(j / longSlices * Math.PI); // * long * 0.3;
        vertices[verticeCount++] = i * slicesWidth - halfWidth + width / 2 ;            // width / 2 将原始左上角的点平移到（0，0）点
        vertices[verticeCount++] = 0;
        vertices[verticeCount++] = 1;
        vertices[verticeCount++] = 0;
        vertices[verticeCount++] = 1 * 1 / longSlices;
        vertices[verticeCount++] = i * 1 / widhtSlices;
      }
    }

    let indiceIndex = 0;
    for (let i = 0; i < widhtSlices; i++) {
      for (let j = 0; j < longSlices; j++) {
        indices[indiceIndex++] = (i + 1) * (longSlices + 1) + j;
        indices[indiceIndex++] = i * (longSlices + 1) + j;
        indices[indiceIndex++] = (i + 1) * (longSlices + 1) + j + 1;

        indices[indiceIndex++] = i * (longSlices + 1) + j;
        indices[indiceIndex++] = i * (longSlices + 1) + j + 1;
        indices[indiceIndex++] = (i + 1) * (longSlices + 1) + j + 1;

// 			indices[indiceIndex++] = (i + 1) * (stacks + 1) + j;
//      indices[indiceIndex++] = (i + 1) * (stacks + 1) + j + 1;
//      indices[indiceIndex++] = i * (stacks + 1) + j;

// 			indices[indiceIndex++] = i * (stacks + 1) + j;
//      indices[indiceIndex++] = (i + 1) * (stacks + 1) + j + 1;
//      j16 = indices[indiceIndex++] = i * (stacks + 1) + j + 1;
      }
    }

    const PrimitiveMesh: any = Laya.PrimitiveMesh;

    return PrimitiveMesh._createMesh(vertexDeclaration, vertices, indices);
  }
}
