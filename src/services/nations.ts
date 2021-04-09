import { NationCollection } from '../typings'

export const NationService = {
    all: async (): Promise<NationCollection> => {
        // Example data
        return new Promise((resolve, _) => {
            setTimeout(
                () =>
                    resolve([
                        {
                            oid: 400,
                            name: 'vdala nation',
                            short_name: 'vdala',
                            description: 'description',
                            icon_img_src: null,
                            cover_img_src: null,
                            accent_color: '#abcabc',
                            locations: [],
                        },
                        {
                            oid: 300,
                            name: 'norrlands nation',
                            short_name: 'norrlands',
                            description: 'description',
                            icon_img_src: null,
                            cover_img_src: null,
                            accent_color: '#123123',
                            locations: [],
                        },
                    ]),
                1000
            )
        })
    },
}
