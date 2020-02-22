import generateSizes from './generateSizes'
import generateStyles from './generateStyles'
import cleanupStyles from './cleanupStyles'

switch (figma.command) {
    case 'generate-sizes':
        generateSizes();
        break;
    case 'create-text-styles':
        generateStyles();
        break;
    case 'cleanup-text-styles':
        cleanupStyles();
        break;
    default:
        console.log(`Hmm… there isn't a command called ${figma.command}`);
        figma.closePlugin()
}