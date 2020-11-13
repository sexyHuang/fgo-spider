import { ImageItem } from 'src/types';

const getImageMapString = (data: [string, ImageItem][]) => `
import { ImageItem } from 'src/types';

const imageMap = new Map<string, ImageItem>(${JSON.stringify(data, void 0, 2)});

export default imageMap;
`;

export default getImageMapString;
