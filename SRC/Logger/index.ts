import {LoggerFacade} from './LoggerFacade';

var loggerFacade = new LoggerFacade();

loggerFacade.logAuthorizedAccess('Authorized access', {username: 'admin', password: 'admin'});
loggerFacade.logAuthorizedAccess('Authorized access', {username: 'adm2in', password: 'admin'});
loggerFacade.logAuthorizedAccess('Authorized access', {username: 'adm1in', password: 'admin'});
loggerFacade.logAuthorizedAccess('Authorized access', {username: 'admi2n', password: 'admin'});

loggerFacade.logUnauthorizedAccess('Unuthorized access', {username: 'admisn', password: 'admins'});
loggerFacade.logUnauthorizedAccess('Unuthorized access', {username: 'admisn', password: 'admins'});
loggerFacade.logUnauthorizedAccess('Unuthorized access', {username: 'admisn', password: 'admins'});
loggerFacade.logUnauthorizedAccess('Unuthorized access', {username: 'admisn', password: 'admins'});
