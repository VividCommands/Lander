const shot = (file, alt, width = 440, height = 320, format = 'window') => ({src: `img/macro/gallery/${file}.webp`, alt, width, height, format});

export const lifetime = [
  shot('lifetime-drag', 'Macro.io lifetime edition, Drag Edit'),
  shot('lifetime-double', 'Macro.io lifetime edition, Double Edit'),
  shot('lifetime-build', 'Macro.io lifetime edition, Auto Build'),
  shot('lifetime-extras', 'Macro.io lifetime edition, Extras'),
  shot('lifetime-controller', 'Macro.io lifetime edition, controller Double Edit'),
];

const workspace = {src: 'img/macro/pro-workspace.webp', alt: 'Macro.io Pro with Macro IQ and the application menu', width: 986, height: 414, format: 'workspace'};

export const pro = [
  shot('pro-controller-drag', 'Macro.io Pro, controller Drag Edit'),
  shot('pro-advanced', 'Macro.io Pro, advanced Drag Edit timings'),
  shot('pro-drag-simple', 'Macro.io Pro, Drag Edit timing controls'),
  shot('pro-dynamic', 'Macro.io Pro, Dynamic Drag Edit'),
  shot('pro-drag-modes', 'Macro.io Pro, Drag Edit modes'),
  shot('pro-double-timing', 'Macro.io Pro, Double Edit timing controls'),
  shot('pro-elevator', 'Macro.io Pro, Elevator 90s'),
  shot('pro-turbo', 'Macro.io Pro, Turbo Auto Build'),
  shot('pro-extras-blue', 'Macro.io Pro, Extras with the blue theme'),
  shot('pro-extras-pink', 'Macro.io Pro, Extras with the pink theme'),
  shot('pro-lab', 'Macro.io Pro, Macro Lab', 1536, 864, 'wide'),
  shot('pro-controller-queued', 'Macro.io Pro, controller Double Edit with Queued Keys'),
  shot('pro-controller-double', 'Macro.io Pro, controller Double Edit settings'),
  shot('pro-configs', 'Macro.io Pro, saved configurations', 414, 306),
  workspace,
];

export const all = [workspace];
for (let index = 0; index < pro.length - 1; index++) {
  if (lifetime[index]) all.push(lifetime[index]);
  all.push(pro[index]);
}
