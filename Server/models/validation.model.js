const createTaskValidation = validate({
    body: (body) => {
        const errors = [];

        const titleError = validators.requiredString(
            body.title,
            "Task title",
            150
        );

        if (titleError) errors.push(titleError);

        if (body.status !== undefined) {
            const error = validators.enum(
                body.status,
                "Status",
                ["pending", "in-progress", "completed"]
            );

            if (error) errors.push(error);
        }

        if (body.priority !== undefined) {
            const error = validators.enum(
                body.priority,
                "Priority",
                ["low", "medium", "high", "urgent"]
            );

            if (error) errors.push(error);
        }

        return errors;
    },
});