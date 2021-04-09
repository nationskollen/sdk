import { NationCollection } from '../typings'

export const NationService = {
    all: async (): Promise<NationCollection> => {
        // Example data
        return new Promise((resolve, _) => {
            setTimeout(
                () =>
                    resolve([
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
                    ]),
                1000
            )
        })
    },
}
