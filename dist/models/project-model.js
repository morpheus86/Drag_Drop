export class Project {
    constructor(id, title, description, numberOfProple, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.numberOfProple = numberOfProple;
        this.status = status;
    }
}
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
//# sourceMappingURL=project-model.js.map