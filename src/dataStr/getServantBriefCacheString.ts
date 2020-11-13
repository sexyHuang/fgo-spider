import { ServantBriefObj } from 'src/types';

const getServantBriefCacheString = (data: ServantBriefObj[]) => `
import { ServantBriefObj } from 'src/types';

const index: ServantBriefObj[] = ${JSON.stringify(data, void 0, 2)};

export default index;

`;

export default getServantBriefCacheString;
