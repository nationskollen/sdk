import { NationCollection } from '../typings'

export default class NationService {
    public async getNations(): Promise<NationCollection> {
        // Example data
        return [
            {
                oid: 100,
                name: 'vdala nation',
                short_name: 'vdala',
                description: 'description',
                icon_img_src: null,
                cover_img_src: null,
                accent_color: '#abcabc',
                locations: [],
            },
        ]
    }
}
