const fs = require('fs')
const rimraf = require('rimraf')
const iconv = require('iconv-lite');

process.on('exit', (code) => {
    console.log(`运行完毕，退出：${code}`)
})

const PROTEIN_PDB_FILE = 'nhe_***.pdb'
const PROCESS_MAP_FILE = '*****.mrc'
const ARRAY_RESI_NAMES = [
    { name: 'tm1_2', range: '1-150', chain: 'A' }
]

let fileContent = `reini\n`
const pdb_name = PROTEIN_PDB_FILE.split('.')[0]
const map_name = PROCESS_MAP_FILE.split('.')[0]
const basicLoadCmd = [
    `load ${PROTEIN_PDB_FILE}`,
    `load ${PROCESS_MAP_FILE}`,
    `bg_color white`,
    `set_name ${pdb_name},nhe`,
    `set_name ${map_name},map`
]

fileContent += (basicLoadCmd.join('\n') + '\n')

const globalSettingCmd = [
    'set transparency,0.65',
    'set cartoon_oval_length, 0.25',
    'set catroon_oval_width, 0.15',
    'set cartoon_side_chain_helper,1',
    'set ray_shadows, 0',
    'set ray_opaque_background, 0',
    'color lithium',
    'set valence, 0',
    'color red, e. O and nhe',
    'color blue, e. N and nhe',
    'color yellow, e. S and nhe'
]

fileContent += globalSettingCmd.join('\n') + '\n'

const need_create_range = ARRAY_RESI_NAMES.map(item => `create ${item.name}, resi ${item.range} and nhe and chain ${item.chain || 'A'}`).join('\n')

fileContent += (need_create_range + '\n')

const generate_all_scene = ARRAY_RESI_NAMES.map((item) => {
    const itemArrCmd = [
        '',
        `#生成${item.name}的scene空间`,
        'disable *',
        `enable ${item.name}`,
        `isosurface ${item.name}warp,map,5,${item.name},carve=1.9`,
        'show sticks',
        `scene ${item.name},store`
    ]
    return itemArrCmd.join('\n')
}).join('\n')

const save_image_cmd = [
    '#保存png图片的命令',
    '#ray 2000,2000',
    '#png XXX.png'
]

fileContent += (generate_all_scene + '\n' + save_image_cmd.join('\n'))

const save_file_name = `${pdb_name}.txt`
rimraf(save_file_name, () => {
    const gbkStr = iconv.encode(fileContent, 'gbk');
    fs.writeFile(save_file_name, gbkStr, null, () => {
        console.log('txt代码文件生成完毕')
        process.exit(0)
    })
})
