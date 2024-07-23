const fs = require('fs');
const yaml = require('js-yaml');
const encoder = require('@ensdomains/address-encoder');
const simpleGit = require('simple-git');

// 配置文件路径
const DEV_CONFIG_FILES = [
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/dev/compents/spaceid-backend/configmap.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/dev/spaceid-graphigo/kustomization.yaml"
];
const DEV_INPUT_FILE = 'input-dev.txt';

const STG_CONFIG_FILES = [
    '/Users/yz/projects/go/spaceid-infra-bootstrap/app/stg/spaceid-backend-data-processor/kustomization.yaml',
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/stg/spaceid-backend-handler/kustomization.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/stg/spaceid-backend-onchain-consumer/kustomization.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/stg/spaceid-backend-onchain-ingestor/kustomization.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/dev/spaceid-graphigo/kustomization.yaml"
];
const PRD_INPUT_FILE = 'input-dev.txt';

const PRD_CONFIG_FILES = [
    '/Users/yz/projects/go/spaceid-infra-bootstrap/app/prd/spaceid-backend-data-processor/kustomization.yaml',
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/prd/spaceid-backend-handler/kustomization.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/prd/spaceid-backend-onchain-consumer/kustomization.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/prd/spaceid-backend-onchain-ingestor/kustomization.yaml",
    "/Users/yz/projects/go/spaceid-infra-bootstrap/app/prd/spaceid-graphigo/kustomization.yaml"
];

const INPUT_FILE_DEV = 'input-dev.txt';
const INPUT_FILE_PRD = 'input-prd.txt';

const TARGET_DIR = '/Users/yz/projects/go/spaceid-infra-bootstrap';

// 读取配置文件内容并解析为对象
const readYamlFileAsObject = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
};

// 读取输入文件内容并转换为对象
const readInputFileAsObject = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const obj = {};

    lines.forEach((line, index) => {
        line = line.trim();
        if (!line || line.startsWith('#')) {
            return;
        }

        const parts = line.split(':');
        if (parts.length !== 2) {
            console.error(`Invalid line at ${index + 1}: ${line}`);
            return;
        }

        let key = parts[0].trim().replace(/-/g, ''); // 去掉key中的-
        let value = parts[1].trim(); // 保留双引号
        if (!key || !value) {
            console.error(`Invalid key or value at line ${index + 1}: ${line}`);
            return;
        }
        obj[key] = value;
    });

    return obj;
};

// 将对象转换为YAML文件内容并写入文件
const writeObjectToYamlFile = (filePath, obj) => {
    const content = yaml.dump(obj, { lineWidth: -1 });
    fs.writeFileSync(filePath, content, 'utf8');
};

// 为 data 字段中的所有值添加双引号
const appendToKey = (obj, key, newValue) => {
    const existingValue = obj[key];
    if (existingValue) {
        obj[key] = existingValue.replace(/(^['"]|['"]$)/g, '') + `,${newValue}`;
    } else {
        obj[key] = newValue;
    }
};

const appendToKusKey = (literals, key, newValue) => {
    const existingEntryIndex = literals.findIndex((entry) => entry.startsWith(`${key}=`));
    if (existingEntryIndex !== -1) {
        const existingEntry = literals[existingEntryIndex];
        const existingValue = existingEntry.split('=')[1].replace(/"/g, '');
        literals[existingEntryIndex] = `${key}="${existingValue},${newValue}"`;
    }
};

// Git 提交和推送
const gitCommitAndPush = async (message) => {
    const git = simpleGit();
    try {
        process.chdir(TARGET_DIR);
        await git.commit(message);
        // await git.push();
        console.log('Changes committed and pushed to Git.');
    } catch (err) {
        console.error('Error committing and pushing to Git:', err);
    }
};

const objectToYamlString = (obj) => {
    let yamlString = `apiVersion: ${obj.apiVersion}\n`;
    yamlString += `kind: ${obj.kind}\n`;
    yamlString += `metadata:\n  name: ${obj.metadata.name}\n`;
    yamlString += `data:\n`;
    for (const key in obj.data) {
        yamlString += `  ${key}: "${obj.data[key]}"\n`;
    }
    return yamlString;
};

// 主函数
const main = async () => {
    for (const configFile of PRD_CONFIG_FILES) {
        try {
            const config = readYamlFileAsObject(configFile);
            const input = readInputFileAsObject(INPUT_FILE_PRD);

            const tldName = "AILAYER"
            const network = 18
            const rpcuRL = "mainnet-rpc.ailayer.xyz"
            const startBlockNumber = "3429398"
            const wtokenContract = "0x1470a4831f76954686bfb4de8180f7469ea8de6f"
            const tokenName = "BTC"
            const wtokenName = "WBTC"
            const chainID = 2649
            const typeDefaultVal = encoder.convertEVMChainIdToCoinType(chainID);
            const seaportContract="0x00000000006c3852cbef3e08e8df289169ede581"
            const seaportV14Contract="0x00000000000001ad428e4906ae43d8f9852d0dd6"
            const seaportV15Contract="0x00000000000000adc04c56bf30ac9d3c0aaf14dc"

            // 更新配置
            if (config.configMapGenerator && config.configMapGenerator[0].literals) {
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_SEAPORT_CONTRACT_MAP', `${network}:${seaportContract}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_SEAPORT_V14_CONTRACT_MAP', `${network}:${seaportV14Contract}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_SEAPORT_V15_CONTRACT_MAP', `${network}:${seaportV15Contract}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'REGISTRY_ADDRS', `${network}:${input.registryaddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_TLD_SANN_MAP', `${network}:${input.sannaddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_TOOL_KIT_CONTROLLER_MAP', `${network}:${input.controlleraddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'REVERSE_REGISTRAR_ADDRS', `${network}:${input.reverseregistraraddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_PRICE_CONTRACT_MAP', `${network}:${input.priceoracleaddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_TLD_FACTORY_MAP', `${network}:${input.tldfactoryaddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_GIFT_CARD_VOUCHER_CONTRACT_MAP', `${network}:${input.giftcardvoucheraddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_TLD_REFERRAL_HUB_CONTRACT_MAP', `${network}:${input.referralhubaddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_PREREG_CREATOR_CONTRACT_MAP', `${network}:${input.preregistrationcreatoraddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'RESOLVER_ADDRS', `${network}:${input.resolveraddr}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_TOKEN_NAME_MAP', `${network}:${tokenName}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_WTOKEN_NAME_MAP', `${network}:${wtokenName}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'ENABLE_CHAIN_MAP', `${network}:true`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_ID_MAP', `${network}:${chainID}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'COIN_TYPE_DEFAULT_MAP', `${network}:${typeDefaultVal}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_DELAY_BLOCK_CNT_MAP', `${network}:0`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_CONFIRMATION_BLOCKS_NEEDED_MAP', `${network}:12`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_MAX_BLOCK_CNT_EVERY_QUERY_MAP', `${network}:200`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_BLOCK_TIME_FETCH_STEP_MAP', `${network}:20`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_TLD_DEPENDENCY_GAP_BLOCK_NUMBER_MAP', `${network}:20`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_RPC_URL_MAP', `${network}:${rpcuRL}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_BLOCK_TIME_START_BLOCK_NUMBER_MAP', `${network}:${startBlockNumber}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_WTOKEN_CONTRACT_MAP', `${network}:${wtokenContract}`);
                appendToKusKey(config.configMapGenerator[0].literals, 'CHAIN_NAME_MAP', `${network}:${tldName}`);
                writeObjectToYamlFile(configFile, config);
            } else if (config.data) {
                appendToKey(config.data, 'CHAIN_SEAPORT_CONTRACT_MAP', `${network}:${seaportContract}`);
                appendToKey(config.data, 'CHAIN_SEAPORT_V14_CONTRACT_MAP', `${network}:${seaportV14Contract}`);
                appendToKey(config.data, 'CHAIN_SEAPORT_V15_CONTRACT_MAP', `${network}:${seaportV15Contract}`);
                appendToKey(config.data, 'REGISTRY_ADDRS', `${network}:${input.registryaddr}`);
                appendToKey(config.data, 'CHAIN_TLD_SANN_MAP', `${network}:${input.sannaddr}`);
                appendToKey(config.data, 'CHAIN_TOOL_KIT_CONTROLLER_MAP', `${network}:${input.controlleraddr}`);
                appendToKey(config.data, 'REVERSE_REGISTRAR_ADDRS', `${network}:${input.reverseregistraraddr}`);
                appendToKey(config.data, 'CHAIN_PRICE_CONTRACT_MAP', `${network}:${input.priceoracleaddr}`);
                appendToKey(config.data, 'CHAIN_TLD_FACTORY_MAP', `${network}:${input.tldfactoryaddr}`);
                appendToKey(config.data, 'CHAIN_GIFT_CARD_VOUCHER_CONTRACT_MAP', `${network}:${input.giftcardvoucheraddr}`);
                appendToKey(config.data, 'CHAIN_TLD_REFERRAL_HUB_CONTRACT_MAP', `${network}:${input.referralhubaddr}`);
                appendToKey(config.data, 'CHAIN_PREREG_CREATOR_CONTRACT_MAP', `${network}:${input.preregistrationcreatoraddr}`);
                appendToKey(config.data, 'RESOLVER_ADDRS', `${network}:${input.resolveraddr}`);
                appendToKey(config.data, 'CHAIN_TOKEN_NAME_MAP', `${network}:${tokenName}`);
                appendToKey(config.data, 'CHAIN_WTOKEN_NAME_MAP', `${network}:${wtokenName}`);
                appendToKey(config.data, 'ENABLE_CHAIN_MAP', `${network}:true`);
                appendToKey(config.data, 'CHAIN_ID_MAP', `${network}:${chainID}`);
                appendToKey(config.data, 'COIN_TYPE_DEFAULT_MAP', `${network}:${typeDefaultVal}`);
                appendToKey(config.data, 'CHAIN_DELAY_BLOCK_CNT_MAP', `${network}:0`);
                appendToKey(config.data, 'CHAIN_CONFIRMATION_BLOCKS_NEEDED_MAP', `${network}:12`);
                appendToKey(config.data, 'CHAIN_MAX_BLOCK_CNT_EVERY_QUERY_MAP', `${network}:200`);
                appendToKey(config.data, 'CHAIN_BLOCK_TIME_FETCH_STEP_MAP', `${network}:20`);
                appendToKey(config.data, 'CHAIN_TLD_DEPENDENCY_GAP_BLOCK_NUMBER_MAP', `${network}:20`);
                appendToKey(config.data, 'CHAIN_RPC_URL_MAP', `${network}:${rpcuRL}`);
                appendToKey(config.data, 'CHAIN_BLOCK_TIME_START_BLOCK_NUMBER_MAP', `${network}:${startBlockNumber}`);
                appendToKey(config.data, 'CHAIN_WTOKEN_CONTRACT_MAP', `${network}:${wtokenContract}`);
                appendToKey(config.data, 'CHAIN_NAME_MAP', `${network}:${tldName}`);
                writeObjectToYamlFile(configFile, objectToYamlString(config));
            }

            // await gitCommitAndPush(`Update kustomization.yaml for ${tldName}`);

            console.log('Config file updated.');
        } catch (err) {
            console.error('Error updating config file:', err);
        }
    }
};

main();
