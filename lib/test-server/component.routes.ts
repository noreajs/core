import { NoreaRouter } from "../interfaces";

export default (router: NoreaRouter) => {
    /**
    *  Routes
    */
    router.group("/:pack/components", {
        routes: (module) => {
            /**
            * Get all page components
            */
            module
                .route("")
                .get((req, res) => { 
                    
                });
            /**
            * Create page component
            */
            module
                .route("")
                .post([(req, res) => { }]);
            /**
            * Show page component
            */
            module
                .route("/:id")
                .get([(req, res) => { }]);
            /**
            * Edit page component
            */
            module
                .route("/:id")
                .put([(req, res, next) => { }]);

            /**
            * Publish page component
            */
            module
                .route("/:id/publish")
                .patch([(req, res) => { }]);

            /**
            * unpublish page component
            */
            module
                .route("/:id/unpublish")
                .patch([(req, res) => { }]);

            /**
            * Delete page component
            */
            module
                .route("/:id")
                .delete([(req, res) => { }]);
        },
    });
}