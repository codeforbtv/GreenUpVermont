# Reporting Greenup Data

The app data is stored in Firestore. This is a great choice for many reasons, but one drawback is that it is not well suited to exporting or analysing data. But we can get around that using Google Cloud tools like BigQuery.

## Export to BigQuery

BigQuery is one of the best ways to quickly analyze Firestore data.  The big trick is that you can only import one firestore collection at a time. Here's how:

1) **You'll need permission**: If you haven't done this before, you'll need to have the correct permissions. You can work with the GreenUp team-lead and/or [get the details here](https://cloud.google.com/firestore/docs/manage-data/export-import#before_you_begin).

2) **Open a CloudShell session**: Go to [console.cloud.google.com](https://console.cloud.google.com/home/dashboard?project=greenupvermont-de02b&cloudshell=true) and click the <img src="https://cloud.google.com/shell/docs/images/activate_cloud_shell.svg"> icon at the top of the screen if the shell doesn't begin loading at the bottom of the screen right away.

3) **Export a collection to Cloud Storage**: Firebase will dump it's export in a bucket in Cloud Storage, then we will import it in BigQuery. Also, BigQuery can't import the whole database, so we'll have to do this step for each collection we want to analyze. [Follow these directions](https://cloud.google.com/firestore/docs/manage-data/export-import#export_specific_collections) and you'll run a command like this in CloudShell

```
$ gcloud firestore export gs://greenup-2020-prod-data --collection-ids=profiles
```

4) **Confirm the Cloud Storage import**: Click through to [Cloud Storage bucket](https://console.cloud.google.com/storage/browser/greenup-2020-prod-data) you exported to. Drill down all the folders until you get the bottom.  If you see a file named something like `all_namespaces_kind_profiles.export_metadata` (where "profiles" matches the collection you exported) then you probably did it right.  If not, and if things fail later on, [read this part of the next step](https://cloud.google.com/bigquery/docs/loading-data-cloud-firestore#loading_cloud_firestore_export_service_data) carefully, then go back to step 3 and try again.

5) **Import to BigQuery**: [follow these directions](https://cloud.google.com/bigquery/docs/loading-data-cloud-firestore#loading_cloud_firestore_export_service_data).

And now you should have all the info you need in BigQuery to play around with. 

To browse your data, drill down to the table you want to see in the "Resources" section and click "Schema" or "Preview".

<img src="https://content.screencast.com/users/doub1ejack/folders/Capture/media/55f05bf6-512d-4019-bf22-95aa84533601/screenshot.png">