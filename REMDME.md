首先要把 *.pdb和 *.mrc 放到相同的路径下
需要修改的三个变量
PROTEIN_PDB_FILE pdb的文件名
PROCESS_MAP_FILE mrc(map)文件名
ARRAY_RESI_NAMES = [
    { name: 'tm1_2', range: '1-150', chain: 'A' }
] // 要分隔的所有链。chain变量不写则默认为A