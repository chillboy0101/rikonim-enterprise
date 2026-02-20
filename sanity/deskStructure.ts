import type { StructureResolver } from 'sanity/desk';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('siteSettings').title('Site Settings'),
      S.listItem()
        .title('Projects')
        .id('projects')
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('Published Projects')
                .id('projects.published')
                .child(
                  S.documentTypeList('project')
                    .title('Published Projects')
                    .filter('_type == "project" && (draft != true) && !(_id in path("drafts.**"))')
                ),
              S.listItem()
                .title('Draft Projects')
                .id('projects.drafts')
                .child(
                  S.documentTypeList('project')
                    .title('Draft Projects')
                    .filter('_type == "project" && (draft == true || _id in path("drafts.**"))')
                )
            ])
        ),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id !== 'siteSettings' && id !== 'project';
      })
    ]);
