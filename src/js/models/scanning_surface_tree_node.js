import TreeNode from "./tree_node";

export default class ScanningSurfaceTreeNode extends TreeNode {
    circunference(radius) {
        let matrices = []
        
        for (let i = 0; i < 30; i++) {
            alpha = (i / 30) * 2 * Math.PI;
            let x = radius * Math.cos(alpha);
            let y = radius * Math.sin(alpha);

            matrix = mat3.create();

            // TODO: definir matriz con normal, tangente, binormal y puntos de la curva
            // par cada punto de la curva de nivel (prestar mas atencion a las normaless)

            matrices.push(matrix);
        }

        return points
    }
    
    levelCurvePoints() { // los hijos deben implementar
        [
            [0,0,0],
            [0,0,0.2],
            ...
        ]
    }

    controlCurveMatrices() { // los hijos deben implementar
        [
            matriz de punto 1,
            matriz de punto 2,
            ...
        ]
    }

    buildBuffers() {
        // hacer cosas con niveles y matrices de ptos de control
    }
}
