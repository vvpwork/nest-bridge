'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' : 'data-target="#xs-controllers-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' :
                                            'id="xs-controllers-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' : 'data-target="#xs-injectables-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' :
                                        'id="xs-injectables-links-module-AuthModule-76301299d3570b34a3e8afd1f4f290c560751dcd9f0494363516ddb939710d04474d849c4253c71113ac0fc82a6dc18eb3344d81cf8f7bc3c7d478ee88b8dce2"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BlockchainModule.html" data-type="entity-link" >BlockchainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-BlockchainModule-13dcb711093089e1fe226b0534e18f003a3db80eb4aabb25b7bc0391719d28ac0ad925f6cc1367ecaf2b55f53f3f5ef1bbb11049558aa20141a52cfd94ba72ad"' : 'data-target="#xs-injectables-links-module-BlockchainModule-13dcb711093089e1fe226b0534e18f003a3db80eb4aabb25b7bc0391719d28ac0ad925f6cc1367ecaf2b55f53f3f5ef1bbb11049558aa20141a52cfd94ba72ad"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BlockchainModule-13dcb711093089e1fe226b0534e18f003a3db80eb4aabb25b7bc0391719d28ac0ad925f6cc1367ecaf2b55f53f3f5ef1bbb11049558aa20141a52cfd94ba72ad"' :
                                        'id="xs-injectables-links-module-BlockchainModule-13dcb711093089e1fe226b0534e18f003a3db80eb4aabb25b7bc0391719d28ac0ad925f6cc1367ecaf2b55f53f3f5ef1bbb11049558aa20141a52cfd94ba72ad"' }>
                                        <li class="link">
                                            <a href="injectables/BlockchainService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlockchainService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CollectionModule.html" data-type="entity-link" >CollectionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' : 'data-target="#xs-controllers-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' :
                                            'id="xs-controllers-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' }>
                                            <li class="link">
                                                <a href="controllers/CollectionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' : 'data-target="#xs-injectables-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' :
                                        'id="xs-injectables-links-module-CollectionModule-92361a97b68373e76e40e65849df07f75a13178d2f793f101eb1879fd9dc1488f4977717500e1dc0caf3be2c414ffa155ab3ec2a32870480cee236fea3f93967"' }>
                                        <li class="link">
                                            <a href="injectables/CollectionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigApiModule.html" data-type="entity-link" >ConfigApiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ConfigApiModule-a36f5114fc5d34ffaad8aea37057c1cbed1a49d908f2ef5881c737309310b849b5607042f7d9b2133363b46f862f802bc7d08f81ba04a2342b5a88afd66e582c"' : 'data-target="#xs-controllers-links-module-ConfigApiModule-a36f5114fc5d34ffaad8aea37057c1cbed1a49d908f2ef5881c737309310b849b5607042f7d9b2133363b46f862f802bc7d08f81ba04a2342b5a88afd66e582c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ConfigApiModule-a36f5114fc5d34ffaad8aea37057c1cbed1a49d908f2ef5881c737309310b849b5607042f7d9b2133363b46f862f802bc7d08f81ba04a2342b5a88afd66e582c"' :
                                            'id="xs-controllers-links-module-ConfigApiModule-a36f5114fc5d34ffaad8aea37057c1cbed1a49d908f2ef5881c737309310b849b5607042f7d9b2133363b46f862f802bc7d08f81ba04a2342b5a88afd66e582c"' }>
                                            <li class="link">
                                                <a href="controllers/ConfigApiController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigApiController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CreatorsModule.html" data-type="entity-link" >CreatorsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' : 'data-target="#xs-controllers-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' :
                                            'id="xs-controllers-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' }>
                                            <li class="link">
                                                <a href="controllers/CreatorsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatorsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' : 'data-target="#xs-injectables-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' :
                                        'id="xs-injectables-links-module-CreatorsModule-a5fc98fcda4c6c709eb5d7720d379565b1964f35d74006949661e6451bcec7d038036e937bae9d6e59a6c31da27f5a035f27f9f750f0ff900231ded4f2eb4252"' }>
                                        <li class="link">
                                            <a href="injectables/CreatorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatorsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthCheckModule.html" data-type="entity-link" >HealthCheckModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HealthCheckModule-262a93d305c206dd017dd2238fe5e1241219b87d6c0edd723036a914bf78889943ccae90cb8fc98cd9ea864e566853ebda949d5b5827dc5c47ec9c66a3a805fc"' : 'data-target="#xs-controllers-links-module-HealthCheckModule-262a93d305c206dd017dd2238fe5e1241219b87d6c0edd723036a914bf78889943ccae90cb8fc98cd9ea864e566853ebda949d5b5827dc5c47ec9c66a3a805fc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthCheckModule-262a93d305c206dd017dd2238fe5e1241219b87d6c0edd723036a914bf78889943ccae90cb8fc98cd9ea864e566853ebda949d5b5827dc5c47ec9c66a3a805fc"' :
                                            'id="xs-controllers-links-module-HealthCheckModule-262a93d305c206dd017dd2238fe5e1241219b87d6c0edd723036a914bf78889943ccae90cb8fc98cd9ea864e566853ebda949d5b5827dc5c47ec9c66a3a805fc"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IdentityModule.html" data-type="entity-link" >IdentityModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-IdentityModule-7c7e22e929985ad049c0dd2ce480c65250a16a8135149ad2fe4f3e67cdcbc4f77919845b3aca51932cc245e410604abcc9e664c90e64342d884c8a69b747e707"' : 'data-target="#xs-injectables-links-module-IdentityModule-7c7e22e929985ad049c0dd2ce480c65250a16a8135149ad2fe4f3e67cdcbc4f77919845b3aca51932cc245e410604abcc9e664c90e64342d884c8a69b747e707"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IdentityModule-7c7e22e929985ad049c0dd2ce480c65250a16a8135149ad2fe4f3e67cdcbc4f77919845b3aca51932cc245e410604abcc9e664c90e64342d884c8a69b747e707"' :
                                        'id="xs-injectables-links-module-IdentityModule-7c7e22e929985ad049c0dd2ce480c65250a16a8135149ad2fe4f3e67cdcbc4f77919845b3aca51932cc245e410604abcc9e664c90e64342d884c8a69b747e707"' }>
                                        <li class="link">
                                            <a href="injectables/IdentityService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IdentityService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LibraryModule.html" data-type="entity-link" >LibraryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' : 'data-target="#xs-controllers-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' :
                                            'id="xs-controllers-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' }>
                                            <li class="link">
                                                <a href="controllers/LibraryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LibraryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' : 'data-target="#xs-injectables-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' :
                                        'id="xs-injectables-links-module-LibraryModule-69e1bdacde0a38174c27d7bf334f646d9a64c8b7189d88d8ac79a823517baf16c8b6c02e1cb4da1da5e76ea679f1854827b83e7ee66229859640caa805bd5514"' }>
                                        <li class="link">
                                            <a href="injectables/LibraryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LibraryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NewsModule.html" data-type="entity-link" >NewsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' : 'data-target="#xs-controllers-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' :
                                            'id="xs-controllers-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' }>
                                            <li class="link">
                                                <a href="controllers/NewsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NewsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' : 'data-target="#xs-injectables-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' :
                                        'id="xs-injectables-links-module-NewsModule-f2ee71a2ca51b4571ed112ce708b1bc502e84a4b434a3b8fe07533f1434998a8c310ab285beebbfeaa4f4eff077b7c258802e4935b84cac6de0d7172d28d57e7"' }>
                                        <li class="link">
                                            <a href="injectables/NewsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NewsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NftModule.html" data-type="entity-link" >NftModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' : 'data-target="#xs-controllers-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' :
                                            'id="xs-controllers-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' }>
                                            <li class="link">
                                                <a href="controllers/NftController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NftController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' : 'data-target="#xs-injectables-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' :
                                        'id="xs-injectables-links-module-NftModule-7936986801ef08336c1c78ae756eff5c2c4a9aa3aed46d120ea57686f20b81bfbcad4d0b02f765bac829622023a8b71fb40520cb982a5c04f0bb0873c790d122"' }>
                                        <li class="link">
                                            <a href="injectables/NftService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NftService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationModule.html" data-type="entity-link" >NotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' : 'data-target="#xs-controllers-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' :
                                            'id="xs-controllers-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' }>
                                            <li class="link">
                                                <a href="controllers/NotificationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' : 'data-target="#xs-injectables-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' :
                                        'id="xs-injectables-links-module-NotificationModule-bf5eca8a4d52826aa57e387af65eccd78b9e2e70183d724c0a7625e01abecb4fb47e93f2645ca14287885482a5cba8ee815d0e7ddce9e0ee6762de9dd846fff8"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrderModule.html" data-type="entity-link" >OrderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' : 'data-target="#xs-controllers-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' :
                                            'id="xs-controllers-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' }>
                                            <li class="link">
                                                <a href="controllers/OrderController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' : 'data-target="#xs-injectables-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' :
                                        'id="xs-injectables-links-module-OrderModule-71ab73ff1cca217d8605e60bd980e9ee3eb831a92e03415b5cd63bf650596306211822c4368c8ba672f7560f31e05a39bafb5eb60e3902486e3ab72fede1a6f2"' }>
                                        <li class="link">
                                            <a href="injectables/OrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PodcastModule.html" data-type="entity-link" >PodcastModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' : 'data-target="#xs-controllers-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' :
                                            'id="xs-controllers-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' }>
                                            <li class="link">
                                                <a href="controllers/PodcastController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PodcastController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' : 'data-target="#xs-injectables-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' :
                                        'id="xs-injectables-links-module-PodcastModule-730edfd6d033507a2f42fb479869d72b919e73fc5ca19ec44111aedd7d2d0b1fd64d38e46aaa7845b90be25ce5739c25dbd93c58c341ffe23ce1a2ad6b13d688"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PodcastService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PodcastService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' : 'data-target="#xs-controllers-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' :
                                            'id="xs-controllers-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' : 'data-target="#xs-injectables-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' :
                                        'id="xs-injectables-links-module-ProfileModule-0e72f6d21ac74d8f3841e489fd43447faf0116ce4b04658d6dd4f876fcf6e0dec1deacd4f5739199b0101f9a2e5c323472151cd123b0070a6135d8071a91490d"' }>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RabbitModule.html" data-type="entity-link" >RabbitModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RabbitModule-9a64014d988c3e935b6b445a3d4d6c9e0e7d00b4684cde6093ce953f879efafb06c74d42494201d43a92707339608a61778092cc5d4954fbaa58ada64d584982"' : 'data-target="#xs-injectables-links-module-RabbitModule-9a64014d988c3e935b6b445a3d4d6c9e0e7d00b4684cde6093ce953f879efafb06c74d42494201d43a92707339608a61778092cc5d4954fbaa58ada64d584982"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RabbitModule-9a64014d988c3e935b6b445a3d4d6c9e0e7d00b4684cde6093ce953f879efafb06c74d42494201d43a92707339608a61778092cc5d4954fbaa58ada64d584982"' :
                                        'id="xs-injectables-links-module-RabbitModule-9a64014d988c3e935b6b445a3d4d6c9e0e7d00b4684cde6093ce953f879efafb06c74d42494201d43a92707339608a61778092cc5d4954fbaa58ada64d584982"' }>
                                        <li class="link">
                                            <a href="injectables/RabbitRootService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RabbitRootService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SecuritizeModule.html" data-type="entity-link" >SecuritizeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SecuritizeModule-74e9ef25ff9a72d8d29cd599ddd7cf86e137ba9aa3714ba89eb510a7b994eb944831a681d60d62ffe5bfb8eb8040a97ea3b1fa8108a59a8d852069a85ccb9443"' : 'data-target="#xs-injectables-links-module-SecuritizeModule-74e9ef25ff9a72d8d29cd599ddd7cf86e137ba9aa3714ba89eb510a7b994eb944831a681d60d62ffe5bfb8eb8040a97ea3b1fa8108a59a8d852069a85ccb9443"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SecuritizeModule-74e9ef25ff9a72d8d29cd599ddd7cf86e137ba9aa3714ba89eb510a7b994eb944831a681d60d62ffe5bfb8eb8040a97ea3b1fa8108a59a8d852069a85ccb9443"' :
                                        'id="xs-injectables-links-module-SecuritizeModule-74e9ef25ff9a72d8d29cd599ddd7cf86e137ba9aa3714ba89eb510a7b994eb944831a681d60d62ffe5bfb8eb8040a97ea3b1fa8108a59a8d852069a85ccb9443"' }>
                                        <li class="link">
                                            <a href="injectables/SecuritizeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SecuritizeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SseModule.html" data-type="entity-link" >SseModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' : 'data-target="#xs-controllers-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' :
                                            'id="xs-controllers-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' }>
                                            <li class="link">
                                                <a href="controllers/SseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SseController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' : 'data-target="#xs-injectables-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' :
                                        'id="xs-injectables-links-module-SseModule-8ab46d05c60ac113f0b580c63a9e7801a3ad4dc1a43751285fb432d31fe0b424a07145a020d45dbb7259bb69c5b67087d04b332aeb969bec4519cc75c52da372"' }>
                                        <li class="link">
                                            <a href="injectables/SseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionHistoryModule.html" data-type="entity-link" >TransactionHistoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' : 'data-target="#xs-controllers-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' :
                                            'id="xs-controllers-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' }>
                                            <li class="link">
                                                <a href="controllers/TransactionHistoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionHistoryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' : 'data-target="#xs-injectables-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' :
                                        'id="xs-injectables-links-module-TransactionHistoryModule-f7beeb7e586095cb9ddcd154e985cd6d200cbc9f4388f70d1874807a89fb7b9068ad57b0f9d4a742ea926eb490f764b757ee5b4a21b50026d6764e54bd2c5eee"' }>
                                        <li class="link">
                                            <a href="injectables/TransactionHistoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionHistoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CollectionController.html" data-type="entity-link" >CollectionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ConfigApiController.html" data-type="entity-link" >ConfigApiController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CreatorsController.html" data-type="entity-link" >CreatorsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HealthController.html" data-type="entity-link" >HealthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/LibraryController.html" data-type="entity-link" >LibraryController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NewsController.html" data-type="entity-link" >NewsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NftController.html" data-type="entity-link" >NftController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NotificationController.html" data-type="entity-link" >NotificationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrderController.html" data-type="entity-link" >OrderController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PodcastController.html" data-type="entity-link" >PodcastController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProfileController.html" data-type="entity-link" >ProfileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SecuritizeController.html" data-type="entity-link" >SecuritizeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SseController.html" data-type="entity-link" >SseController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TransactionHistoryController.html" data-type="entity-link" >TransactionHistoryController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccountTypeModel.html" data-type="entity-link" >AccountTypeModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlockchainIdentityAddressModel.html" data-type="entity-link" >BlockchainIdentityAddressModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlockchainModel.html" data-type="entity-link" >BlockchainModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Bn.html" data-type="entity-link" >Bn</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloudinaryService.html" data-type="entity-link" >CloudinaryService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionModel.html" data-type="entity-link" >CollectionModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigResponseDto.html" data-type="entity-link" >ConfigResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLibraryDto.html" data-type="entity-link" >CreateLibraryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNewsDto.html" data-type="entity-link" >CreateNewsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePodcastDto.html" data-type="entity-link" >CreatePodcastDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTransactionDto.html" data-type="entity-link" >CreateTransactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurrenciesModel.html" data-type="entity-link" >CurrenciesModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditLibraryDto.html" data-type="entity-link" >EditLibraryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditNewsDto.html" data-type="entity-link" >EditNewsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditPodcastDto.html" data-type="entity-link" >EditPodcastDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditProfileDto.html" data-type="entity-link" >EditProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExceptionsFilter.html" data-type="entity-link" >ExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/FollowerModel.html" data-type="entity-link" >FollowerModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FollowResponseDto.html" data-type="entity-link" >FollowResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IBuyOrderRequest.html" data-type="entity-link" >IBuyOrderRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionCreate.html" data-type="entity-link" >ICollectionCreate</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionCreateDto.html" data-type="entity-link" >ICollectionCreateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionIdentity.html" data-type="entity-link" >ICollectionIdentity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionQueryDto.html" data-type="entity-link" >ICollectionQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionReadDto.html" data-type="entity-link" >ICollectionReadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionResponse.html" data-type="entity-link" >ICollectionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICollectionResponse-1.html" data-type="entity-link" >ICollectionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICommunityLinkResponseDto.html" data-type="entity-link" >ICommunityLinkResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IConfigResponseDto.html" data-type="entity-link" >IConfigResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICreateOrderDto.html" data-type="entity-link" >ICreateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICreateOrderResponseDto.html" data-type="entity-link" >ICreateOrderResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICreatorsResponse.html" data-type="entity-link" >ICreatorsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICreatorsResponseData.html" data-type="entity-link" >ICreatorsResponseData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ICretortsQueryDto.html" data-type="entity-link" >ICretortsQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityModel.html" data-type="entity-link" >IdentityModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityNftBalanceLock.html" data-type="entity-link" >IdentityNftBalanceLock</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityNftBalanceModel.html" data-type="entity-link" >IdentityNftBalanceModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityNftBalanceStatusModel.html" data-type="entity-link" >IdentityNftBalanceStatusModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityNftCreatorModel.html" data-type="entity-link" >IdentityNftCreatorModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityResponseDto.html" data-type="entity-link" >IdentityResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ILibraryResponseDto.html" data-type="entity-link" >ILibraryResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ILockDataDto.html" data-type="entity-link" >ILockDataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ILoginResponse.html" data-type="entity-link" >ILoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ILoginResponseData.html" data-type="entity-link" >ILoginResponseData</a>
                            </li>
                            <li class="link">
                                <a href="classes/INewsResponseDto.html" data-type="entity-link" >INewsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/INftHistoryResponseDto.html" data-type="entity-link" >INftHistoryResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/INftQueryDto.html" data-type="entity-link" >INftQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/INftResponse.html" data-type="entity-link" >INftResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/IOnSalesData.html" data-type="entity-link" >IOnSalesData</a>
                            </li>
                            <li class="link">
                                <a href="classes/IOwners.html" data-type="entity-link" >IOwners</a>
                            </li>
                            <li class="link">
                                <a href="classes/IPodcastResponseDto.html" data-type="entity-link" >IPodcastResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfileData.html" data-type="entity-link" >IProfileData</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfileDetailedResponseDto.html" data-type="entity-link" >IProfileDetailedResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfileFollowResponseDto.html" data-type="entity-link" >IProfileFollowResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfileLibrariesResponseDto.html" data-type="entity-link" >IProfileLibrariesResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfileNewsResponseDto.html" data-type="entity-link" >IProfileNewsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfilePodcastResponseDto.html" data-type="entity-link" >IProfilePodcastResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IProfileResponseDto.html" data-type="entity-link" >IProfileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IUpdateOrderDto.html" data-type="entity-link" >IUpdateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IUpdateOrderResponseDto.html" data-type="entity-link" >IUpdateOrderResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LibraryModel.html" data-type="entity-link" >LibraryModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/LibraryResponseDto.html" data-type="entity-link" >LibraryResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewsLikeModel.html" data-type="entity-link" >NewsLikeModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewsModel.html" data-type="entity-link" >NewsModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewsResponseDto.html" data-type="entity-link" >NewsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NftHistoryResponseDto.html" data-type="entity-link" >NftHistoryResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NftLikeModel.html" data-type="entity-link" >NftLikeModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NftModel.html" data-type="entity-link" >NftModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationModel.html" data-type="entity-link" >NotificationModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationTypeModel.html" data-type="entity-link" >NotificationTypeModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdersModel.html" data-type="entity-link" >OrdersModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationQueryDto.html" data-type="entity-link" >PaginationQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationQueryDto-1.html" data-type="entity-link" >PaginationQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationResponseDto.html" data-type="entity-link" >PaginationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationResponseDto-1.html" data-type="entity-link" >PaginationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PodcastModel.html" data-type="entity-link" >PodcastModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/PodcastResponseDto.html" data-type="entity-link" >PodcastResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileModel.html" data-type="entity-link" >ProfileModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileSectionsDto.html" data-type="entity-link" >ProfileSectionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileSocialsDto.html" data-type="entity-link" >ProfileSocialsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RabbitConnect.html" data-type="entity-link" >RabbitConnect</a>
                            </li>
                            <li class="link">
                                <a href="classes/RabbitRPCRequest.html" data-type="entity-link" >RabbitRPCRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RabbitService.html" data-type="entity-link" >RabbitService</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionDataDto.html" data-type="entity-link" >TransactionDataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionHistoryModel.html" data-type="entity-link" >TransactionHistoryModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionHistoryTypeModel.html" data-type="entity-link" >TransactionHistoryTypeModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlockchainService.html" data-type="entity-link" >BlockchainService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CollectionService.html" data-type="entity-link" >CollectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreatorsService.html" data-type="entity-link" >CreatorsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IdentityService.html" data-type="entity-link" >IdentityService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LibraryService.html" data-type="entity-link" >LibraryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NewsService.html" data-type="entity-link" >NewsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NftService.html" data-type="entity-link" >NftService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderService.html" data-type="entity-link" >OrderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PodcastService.html" data-type="entity-link" >PodcastService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RabbitRootService.html" data-type="entity-link" >RabbitRootService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestContext.html" data-type="entity-link" >RequestContext</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecuritizeService.html" data-type="entity-link" >SecuritizeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SseService.html" data-type="entity-link" >SseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransactionHistoryService.html" data-type="entity-link" >TransactionHistoryService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IAuthPayload.html" data-type="entity-link" >IAuthPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBigNumberUtile.html" data-type="entity-link" >IBigNumberUtile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBlockchainIdentityAddress.html" data-type="entity-link" >IBlockchainIdentityAddress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBlockchainModel.html" data-type="entity-link" >IBlockchainModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudinaryUploadFileResponseData.html" data-type="entity-link" >ICloudinaryUploadFileResponseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICollectionModel.html" data-type="entity-link" >ICollectionModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfig.html" data-type="entity-link" >IConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConsumer.html" data-type="entity-link" >IConsumer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICurrenciesModel.html" data-type="entity-link" >ICurrenciesModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFollowerModel.html" data-type="entity-link" >IFollowerModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityAttributes.html" data-type="entity-link" >IIdentityAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityBalanceModel.html" data-type="entity-link" >IIdentityBalanceModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityBlockchainAddressAttributes.html" data-type="entity-link" >IIdentityBlockchainAddressAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityModel.html" data-type="entity-link" >IIdentityModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityNftBalanceLock.html" data-type="entity-link" >IIdentityNftBalanceLock</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIdentityNftCreatorModel.html" data-type="entity-link" >IIdentityNftCreatorModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILibraryModel.html" data-type="entity-link" >ILibraryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMessageRabbit.html" data-type="entity-link" >IMessageRabbit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsLikeModel.html" data-type="entity-link" >INewsLikeModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsModel.html" data-type="entity-link" >INewsModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INftLikeModel.html" data-type="entity-link" >INftLikeModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INftModel.html" data-type="entity-link" >INftModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INotificationModel.html" data-type="entity-link" >INotificationModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOrderModel.html" data-type="entity-link" >IOrderModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPodcastModel.html" data-type="entity-link" >IPodcastModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProfileModel.html" data-type="entity-link" >IProfileModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRabbitConnect.html" data-type="entity-link" >IRabbitConnect</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRabbitRPCRequest.html" data-type="entity-link" >IRabbitRPCRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRabbitService.html" data-type="entity-link" >IRabbitService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRequest.html" data-type="entity-link" >IRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISecuritizeAuthorizeResponseData.html" data-type="entity-link" >ISecuritizeAuthorizeResponseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISecuritizeGetPreparedTransactionResponseData.html" data-type="entity-link" >ISecuritizeGetPreparedTransactionResponseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISecuritizeKycStatusResponseData.html" data-type="entity-link" >ISecuritizeKycStatusResponseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISecuritizeService.html" data-type="entity-link" >ISecuritizeService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITransactionHistory.html" data-type="entity-link" >ITransactionHistory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserInterface.html" data-type="entity-link" >IUserInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserRequest.html" data-type="entity-link" >IUserRequest</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});