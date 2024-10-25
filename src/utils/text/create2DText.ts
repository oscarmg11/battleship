import * as THREE from 'three'

export function create2DText(text: string, options?: Options): THREE.Mesh {
    const letterSize = 1024

    const canvas = document.createElement('canvas');
    canvas.width = letterSize * text.length;
    canvas.height = 1024;

    const context = canvas.getContext('2d');
    if(!context){
        throw new Error('could not find canvas context')
    }

    context.fillStyle = options?.color ?? 'white';
    context.font = `${letterSize}px sans-serif`;
    context.fillText(text, 200, 1024);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(options?.size ?? 1, options?.size ?? 1);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2

    return plane
}

type Options = {
    color?: string;
    size?: number
}
