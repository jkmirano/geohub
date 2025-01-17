# Diagrams

The following diagrams can be helpful to understand the GeoHub structure

## GeoHub Ecosystem

![geohub.svg](./diagrams/geohub.svg)

## Sequence diagrams

The following sequence diagram shows how GeoHub works with other softwares in frontend and backend.

```mermaid
sequenceDiagram
    autonumber
    actor user
    actor developer
    participant cli
    participant client
    participant maplibre
    participant server
    participant titiler
    participant blob as Azure Blob
    participant martin
    participant pg as pg_tileserv
    participant mspc as Microsoft PC
    participant db as PostGIS

    developer->>+cli: execute geohub-cli
    loop Scan datasets
        blob->>cli: scan datasets on blob containers
        martin->>cli: scan datasets on martin
        pg->>cli: scan datasets on pg_tileserv
        mspc->>cli: scan datasets on Microsoft PC
    end
    cli->>db: register datasets
    cli->>-developer: report completion of registration

    user->>client: open GeoHub
    alt is style parameter in URL
        client->>+server: /style - request style info
        server->>db: get style.json from PostGIS
        server->>-client: return style data
    else default
        client->>client: initialise
    end

    user->>client: search datasets
    client->>+server: /datasets - search datasets
    server->>db: search
    db->>server: return datasets
    server->>-client: return datasets as GeoJSON

    user->>+client: add datasets to map
    client->>+server: /vector/{source}/metadata.json
    server->>server: compute metadata
    server->>-client: return metadata.json

    client->>+server: /vector/{source}/tile.json
    server->>server: compute tile
    server->>-client: return tile.json

    client->>maplibre: add layer in source
    maplibre->>blob: request pbf
    maplibre->>martin: request pbf
    martin->>db: get pbf from PostGIS
    maplibre->>pg: request pbf
    pg->>db: get pbf from PostGIS
    maplibre->>+titiler: request raster tiles
    titiler->>blob: read COG
    titiler->>-maplibre: return png
    maplibre->>maplibre: render map

    client->>-user: provide rendered map

    user->>client: operate to save map
    maplibre->>client: style.json
    client->>+server: /style - save style.json
    server->>db: store style data
    server->>-client: return style ID
    user->>client: close GeoHub
```

In terms of Authentication with Azure Active Directory, the following figure shows how authentication works.

```mermaid
sequenceDiagram
    autonumber
    actor user
    participant frontend
    participant backend
    participant authjs as Auth.js
    participant azuread as Azure AD

    user->>frontend: Sign in action
    frontend->>authjs: Call authentication API
    authjs->>azuread: Move to Azure AD login page
    azuread->>user: Request user to login to Microsoft
    user->>azuread: Login to Microsoft
    azuread->>authjs: move to callback URL
    authjs->>backend: store login info in session $page.data.session
    authjs->>frontend: back to original geohub page
    fronend->>user: Sign in complete
```

For the data upload pipeline which is managed by [geohub-data-pipeline](https://github.com/UNDP-Data/geohub-data-pipeline), the workflow is shown as the following diagram.

```mermaid
sequenceDiagram
    autonumber
    actor user
    participant upload as /data/upload
    participant portal as /data
    participant publish as /data/publish
    participant blob as Azure Blob Container
    participant queue as Service Bus Queue
    participant pipeline as GeoHub pipeline (AKS)
    participant db as PostGIS

    user->>+upload: Upload GIS data
    upload->>blob: Upload blob to /raw folder
    upload->>queue: Register message (Blob URL & token)
    upload->>-user: Upload complete

    queue->>pipeline: trigger pipeline, and receive message
    blob->>pipeline: Download dataset from /raw folder
    pipeline->>pipeline: Ingest dataset

    alt if the dataset has a problem
        pipeline->>blob: create .error file at /raw folder
    else if the dataset is ingested successfully
        pipeline->>blob: Upload ingested dataset to /datasets folder together with .ingesting file
    end

    user->>portal: Check the status of uploaded data
    portal->>blob: scan /raw & /datasets folder to gather info
    portal->>user: show the status of uploaded data

    alt if the dataset is ready to publish
        portal->>publish: Input metadata, click publish
        publish->>db: register metadata in DB (it become searchable by /datasets api)
        publish->>db: delete .ingesting file
        publish->>portal: back to /data portal
    else if the dataset has an error
        portal->>portal: Check error message
        portal->>blob: Delete uploaded dataset if user want
    end
```

the diagram was created by [mermaid online editor](https://mermaid.live/edit). Please read syntax of mermaid from the [documentation](https://mermaid.js.org/syntax/sequenceDiagram.htm)

## ER diagram

The following ER diagram was generated by [ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) extension for VS code.

![geohub-database-erd.png](../backends/database/geohub-database-erd.png)
