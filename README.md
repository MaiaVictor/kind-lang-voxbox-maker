Kind-Lang VoxBox Maker
======================

Scans all `.png` files in the current directory and generates `.kind` files with `VoxBox` type.

### Install

```
npm i -g kind-lang-voxbox-maker
```

### Use

```
klvm My.Name.Space [z_index] [z_scale]
```

The generated `.kind` files will contain a hex string in the form of:

```
XXYYZZRRGGBB
```

With 8 bits per value (`x`, `y`, `z`, `r`, `g`, `b`), 48 bits per voxel. 

The resulting origin is located at `x=128, y=128, z=0`.

If `[z_index]` is a number, all `z` is set to `z_index`. If not, all `z` is set to `1`.

If `[z_scale]` is `yes`, each `z` will be incremented by the pixel height (`h - y - 1`).

