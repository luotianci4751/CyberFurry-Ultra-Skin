// ==UserScript==
// @name         「天赐定制 UI v20.0 — 视觉由天赐接管」
// @namespace    http://tampermonkey.net/
// @version      20.0.0
// @description  头像CSRF修复·账户页App化·全子页面视觉统一·键盘零错位·天赐专属标识
// @author       天赐
// @match        *://chat.wingmark.cn/*
// @match        *://*.wingmark.cn/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* ══════════════════════════════════════════
       § 0  宣言
    ══════════════════════════════════════════ */
    console.log(
        '%c天赐定制 UI v20.0 — 视觉由天赐接管。官方高冷，技术自救。',
        'color:#fff;background:linear-gradient(90deg,#007AFF,#00C6FF);' +
        'font-weight:800;font-size:13px;padding:5px 14px;border-radius:8px;'
    );

    /* ══════════════════════════════════════════
       § 1  常量
    ══════════════════════════════════════════ */
    const VER  = '天赐定制 UI v20.0 — 视觉由天赐接管';
    const SID  = 'tc20-style';
    const BH   = 62;
    const TH   = 52;
    const mob  = () => window.innerWidth < 780;

    /* ★ 底部导航显示规则
       - /status/ 路径：显示
       - 包含 module= 的路径：显示
       - 排除登录/验证 */
    const shouldShowBnav = () => {
        const u = location.href;
        if (u.includes('page=login') || u.includes('captcha') || u.includes('verify')) return false;
        return u.includes('module=') || u.includes('/status');
    };

    const NAV = [
        { label:'聊天',     href:'/?page=panel&module=chat_llmv2',       key:'chat_llmv2'       },
        { label:'深度思考', href:'/?page=panel&module=chat_llmthink',    key:'chat_llmthink'    },
        { label:'记忆版',   href:'/?page=panel&module=chat_llmng',       key:'chat_llmng'       },
        { label:'A1 预览',  href:'/?page=panel&module=chat_a1p',         key:'chat_a1p'         },
        { sep:true },
        { label:'账户信息', href:'/?page=panel&module=userinfo',         key:'userinfo'         },
        { label:'Furry AR', href:'/?page=panel&module=furryar',          key:'furryar'          },
        { label:'智能硬件', href:'/?page=panel&module=iot',              key:'iot'              },
        { label:'角色管理', href:'/?page=panel&module=create_cyberfurry',key:'create_cyberfurry'},
        { sep:true },
        { label:'赞助',     href:'/?page=panel&module=donate',           key:'donate'           },
        { label:'反馈',     href:'/?page=panel&module=feedback',         key:'feedback'         },
        { label:'运行状态', href:'/status',                              key:'status', blank:true},
    ];

    const BOT = [
        {
            label:'首页', href:'/?page=panel&module=chat_llmv2', key:'chat_llmv2',
            icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>`,
        },
        {
            label:'Furry AR', href:'/?page=panel&module=furryar', key:'furryar',
            icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><circle cx="12" cy="14" r="3"/><path d="M16 3l-4-2-4 2"/></svg>`,
        },
        {
            label:'运行状态', href:'/status', key:'status',
            icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        },
        {
            label:'账户中心', href:'/?page=panel&module=userinfo', key:'userinfo',
            icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
        },
    ];

    const MODELS = [
        { label:'AgentB 深度思考', href:'/?page=panel&module=chat_llmthink', key:'chat_llmthink' },
        { label:'银影 · 最新版',   href:'/?page=panel&module=chat_llmv2',    key:'chat_llmv2'   },
        { label:'银影 · 记忆版',   href:'/?page=panel&module=chat_llmng',    key:'chat_llmng'   },
        { label:'银影 A1 预览',    href:'/?page=panel&module=chat_a1p',      key:'chat_a1p'     },
    ];

    const TITLES = {
        chat_llmv2:'银影 · 最新版', chat_llmng:'银影 · 记忆版',
        chat_llmthink:'AgentB 深度思考', chat_a1p:'银影 A1 预览',
        userinfo:'账户信息', furryar:'Furry AR 管理', iot:'智能硬件',
        donate:'赞助我们', feedback:'反馈渠道',
        create_cyberfurry:'角色管理', status:'运行状态',
    };

    /* ══════════════════════════════════════════
       § 2  早期锁
    ══════════════════════════════════════════ */
    const early = document.createElement('style');
    early.textContent =
        '.page-sidebar,.page-sidebar *,.page-header,' +
        '.page-footer.afcFooter,div.afcFooter{display:none!important}';
    (document.head || document.documentElement).appendChild(early);

    /* ══════════════════════════════════════════
       § 3  全量 CSS
    ══════════════════════════════════════════ */
    const CSS = `
/* ── reset ── */
*,*::before,*::after{box-sizing:border-box!important}
html{height:100%!important}
body{
    margin:0!important;padding:0!important;background:#F7F8FA!important;
    min-height:100vh!important;
    font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif!important;
    display:flex!important;flex-direction:row!important;align-items:stretch!important;
}
.page-sidebar,.page-sidebar *,.page-header,
.page-footer.afcFooter,div.afcFooter{display:none!important}
.page-container{
    flex:1 1 auto!important;width:0!important;min-width:0!important;
    max-width:none!important;margin:0!important;padding:0!important;
    display:flex!important;flex-direction:column!important;
    min-height:100vh!important;overflow:hidden!important;
}
.page-content,.page-inner{
    flex:1 1 auto!important;width:100%!important;max-width:none!important;
    margin:0!important;padding:0!important;background:transparent!important;
    display:flex!important;flex-direction:column!important;
    overflow-x:auto!important;overflow-y:auto!important;
}
.container,.container-fluid,.main-content,.content-wrapper,
[class*="container"]{
    max-width:none!important;width:100%!important;
    margin-left:0!important;margin-right:0!important;
}

/* ══ PC 侧边栏 ══ */
#tc20-sb{
    width:240px!important;min-width:240px!important;
    flex-shrink:0!important;flex-grow:0!important;
    height:100vh!important;position:sticky!important;top:0!important;
    align-self:flex-start!important;background:#fff!important;
    border-right:1px solid #EAECF0!important;
    display:flex!important;flex-direction:column!important;
    overflow:hidden!important;z-index:600!important;
    transition:width .25s,min-width .25s!important;
}
#tc20-sb.col{width:58px!important;min-width:58px!important;}
#tc20-sbh{
    height:56px!important;display:flex!important;align-items:center!important;
    padding:0 14px!important;gap:10px!important;
    border-bottom:1px solid #EAECF0!important;flex-shrink:0!important;
}
#tc20-logo{
    display:flex!important;align-items:center!important;gap:10px!important;
    text-decoration:none!important;flex:1!important;min-width:0!important;overflow:hidden!important;
}
#tc20-lmk{
    width:32px!important;height:32px!important;border-radius:9px!important;
    background:linear-gradient(135deg,#007AFF,#00C6FF)!important;
    color:#fff!important;font-size:12px!important;font-weight:900!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    flex-shrink:0!important;user-select:none!important;
}
#tc20-ltx{display:flex!important;flex-direction:column!important;overflow:hidden!important;transition:opacity .2s!important;}
#tc20-ln{font-size:13.5px!important;font-weight:700!important;color:#101828!important;white-space:nowrap!important;}
#tc20-ls{font-size:9.5px!important;color:#98A2B3!important;white-space:nowrap!important;}
#tc20-sb.col #tc20-ltx{opacity:0!important;width:0!important;}
#tc20-tog{
    width:26px!important;height:26px!important;border-radius:7px!important;
    border:1px solid #EAECF0!important;background:transparent!important;
    color:#98A2B3!important;cursor:pointer!important;font-size:11px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    flex-shrink:0!important;padding:0!important;
}
#tc20-tog:hover{background:#F2F4F7!important;}
#tc20-sbn{flex:1!important;overflow-y:auto!important;padding:10px 8px!important;}
#tc20-sbn::-webkit-scrollbar{width:0!important;}
.tc20-sep{height:1px!important;background:#EAECF0!important;margin:5px 4px!important;}
.tc20-nl{
    display:block!important;padding:9px 13px!important;border-radius:9px!important;
    color:#475467!important;font-size:13px!important;font-weight:500!important;
    text-decoration:none!important;white-space:nowrap!important;overflow:hidden!important;
    text-overflow:ellipsis!important;transition:background .14s,color .14s!important;
    margin-bottom:2px!important;border:none!important;background:transparent!important;
    width:100%!important;text-align:left!important;cursor:pointer!important;line-height:1.4!important;
}
.tc20-nl:hover{background:#F9FAFB!important;color:#101828!important;}
.tc20-nl.on{background:#EFF8FF!important;color:#007AFF!important;font-weight:600!important;}
#tc20-sb.col .tc20-nl{text-indent:-9999px!important;padding:10px 0!important;}
#tc20-sbf{padding:10px 8px!important;border-top:1px solid #EAECF0!important;flex-shrink:0!important;}

/* ★ 头像容器：用相对定位包一层，透明 <a> 覆盖在上 */
#tc20-sb-user-wrap{
    position:relative!important;
    display:block!important;
    border-radius:9px!important;
    overflow:hidden!important;
}
#tc20-sb-user-wrap a.tc20-av-link{
    position:absolute!important;inset:0!important;
    z-index:2!important;
    background:transparent!important;
    text-decoration:none!important;
    cursor:pointer!important;
    display:block!important;
}
#tc20-lo{
    display:flex!important;align-items:center!important;gap:9px!important;
    padding:8px 13px!important;border-radius:9px!important;text-decoration:none!important;
    color:#667085!important;font-size:13px!important;font-weight:500!important;
    transition:background .14s!important;overflow:hidden!important;white-space:nowrap!important;
    background:transparent!important;width:100%!important;
}
#tc20-sb-user-wrap:hover #tc20-lo{background:#F9FAFB!important;color:#344054!important;}
#tc20-lo img{
    width:28px!important;height:28px!important;border-radius:50%!important;
    object-fit:cover!important;border:1.5px solid #EAECF0!important;flex-shrink:0!important;
}
.tc20-lot{flex:1!important;transition:opacity .2s!important;}
#tc20-sb.col .tc20-lot{opacity:0!important;width:0!important;}
#tc20-sb.col #tc20-sb-user-wrap{justify-content:center!important;}

/* 天赐流光勋章 */
#tc20-medal{
    display:inline-flex!important;align-items:center!important;gap:3px!important;
    margin-left:5px!important;padding:1px 7px 1px 5px!important;border-radius:999px!important;
    background:linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)!important;
    background-size:200% auto!important;animation:tc20-shine 2s linear infinite!important;
    font-size:10px!important;font-weight:800!important;color:#fff!important;
    -webkit-text-fill-color:#fff!important;
    box-shadow:0 1px 6px rgba(255,165,0,0.40)!important;
}
@keyframes tc20-shine{from{background-position:200% center}to{background-position:-200% center}}

/* ══ 移动端抽屉 ══ */
#tc20-mask{
    display:none!important;position:fixed!important;inset:0!important;
    background:rgba(0,0,0,0.42)!important;
    backdrop-filter:blur(4px)!important;-webkit-backdrop-filter:blur(4px)!important;
    z-index:8000!important;pointer-events:auto!important;
}
#tc20-mask.open{display:block!important;}
#tc20-drw{
    position:fixed!important;top:0!important;left:0!important;bottom:0!important;
    width:80vw!important;max-width:300px!important;
    background:rgba(255,255,255,0.96)!important;
    backdrop-filter:blur(24px)!important;-webkit-backdrop-filter:blur(24px)!important;
    border-right:1px solid rgba(0,0,0,0.07)!important;
    z-index:8001!important;display:flex!important;flex-direction:column!important;
    overflow:hidden!important;transform:translateX(-100%)!important;
    transition:transform .28s cubic-bezier(.4,0,.2,1)!important;pointer-events:auto!important;
}
#tc20-drw.open{transform:translateX(0)!important;}
#tc20-drwh{
    height:58px!important;display:flex!important;align-items:center!important;
    padding:0 16px!important;gap:10px!important;
    border-bottom:1px solid rgba(0,0,0,0.07)!important;flex-shrink:0!important;
}
#tc20-drwt{font-size:16px!important;font-weight:800!important;color:#007AFF!important;flex:1!important;}
#tc20-drwc{
    width:30px!important;height:30px!important;border-radius:50%!important;
    border:none!important;background:rgba(0,0,0,0.08)!important;color:#475467!important;
    font-size:16px!important;cursor:pointer!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    padding:0!important;pointer-events:auto!important;
}
#tc20-drwn{flex:1!important;overflow-y:auto!important;padding:12px!important;}
.tc20-dl{
    display:block!important;padding:12px 16px!important;border-radius:10px!important;
    color:#344054!important;font-size:14px!important;font-weight:500!important;
    text-decoration:none!important;margin-bottom:2px!important;
    transition:background .14s!important;cursor:pointer!important;pointer-events:auto!important;
}
.tc20-dl:hover,.tc20-dl:active{background:rgba(0,122,255,0.09)!important;color:#007AFF!important;}
.tc20-dl.on{background:#EFF8FF!important;color:#007AFF!important;font-weight:700!important;}

/* ══ 顶栏 ══ */
#tc20-tb{
    height:${TH}px!important;flex-shrink:0!important;
    display:flex!important;align-items:center!important;
    justify-content:space-between!important;padding:0 16px!important;
    background:rgba(247,248,250,0.93)!important;
    backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;
    border-bottom:1px solid #EAECF0!important;
    position:sticky!important;top:0!important;z-index:500!important;
}
#tc20-tbl{display:flex!important;align-items:center!important;gap:10px!important;}
#tc20-ham{
    display:none!important;width:38px!important;height:38px!important;
    border-radius:9px!important;border:1px solid #EAECF0!important;
    background:transparent!important;color:#344054!important;font-size:20px!important;
    cursor:pointer!important;align-items:center!important;justify-content:center!important;
    padding:0!important;pointer-events:auto!important;z-index:501!important;
}
#tc20-ham:hover{background:#F2F4F7!important;}
#tc20-ttl{font-size:14.5px!important;font-weight:700!important;color:#101828!important;}
#tc20-tbr{display:flex!important;align-items:center!important;gap:8px!important;}
.tc20-tbb{
    height:32px!important;padding:0 12px!important;border-radius:8px!important;
    border:1px solid #EAECF0!important;background:transparent!important;color:#475467!important;
    font-size:12px!important;font-weight:500!important;cursor:pointer!important;
    text-decoration:none!important;display:flex!important;align-items:center!important;
    transition:background .14s!important;white-space:nowrap!important;
}
.tc20-tbb:hover{background:#F2F4F7!important;color:#101828!important;}

/* ★ 顶栏头像：用 position:relative + 透明 a 覆盖，不触碰 onclick */
#tc20-av-wrap{
    position:relative!important;
    display:inline-block!important;flex-shrink:0!important;
}
#tc20-av-wrap a.tc20-av-pc{
    position:absolute!important;inset:0!important;
    z-index:2!important;border-radius:50%!important;
    background:transparent!important;display:block!important;
    cursor:pointer!important;text-decoration:none!important;
}
#tc20-av{
    width:30px!important;height:30px!important;border-radius:50%!important;
    object-fit:cover!important;border:1.5px solid #EAECF0!important;
    display:block!important;
}

/* ══ 底部导航 ══ */
#tc20-bnav{
    display:none!important;
    position:fixed!important;bottom:0!important;left:0!important;right:0!important;
    height:${BH}px!important;
    background:rgba(255,255,255,0.95)!important;
    backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;
    border-top:1px solid rgba(0,0,0,0.09)!important;
    z-index:9999!important;
    flex-direction:row!important;align-items:stretch!important;
    pointer-events:auto!important;
}
#tc20-bnav.visible{display:flex!important;}
.tc20-bn{
    flex:1!important;display:flex!important;flex-direction:column!important;
    align-items:center!important;justify-content:center!important;
    color:#8A94A6!important;font-size:10px!important;font-weight:500!important;
    text-decoration:none!important;gap:4px!important;
    border:none!important;background:transparent!important;padding:6px 0!important;
    pointer-events:auto!important;cursor:pointer!important;
    transition:color .15s!important;
    -webkit-tap-highlight-color:rgba(0,122,255,0.12)!important;
}
.tc20-bn:hover,.tc20-bn:active{color:#007AFF!important;}
.tc20-bn.on{color:#007AFF!important;font-weight:700!important;}
.tc20-bn svg{width:22px!important;height:22px!important;stroke:currentColor!important;transition:transform .15s!important;}
.tc20-bn.on svg{transform:scale(1.12)!important;}

/* ══ 模型提示横幅 ══ */
.tc20-notice{
    display:flex!important;align-items:center!important;justify-content:center!important;
    gap:10px!important;
    background:rgba(255,255,255,0.95)!important;border-radius:12px!important;
    border-left:4px solid #007AFF!important;
    box-shadow:0 4px 15px rgba(0,0,0,0.09)!important;
    padding:9px 18px!important;margin:0 auto 14px!important;
    font-size:13px!important;color:#1D2939!important;font-weight:500!important;
    max-width:900px!important;width:calc(100% - 32px)!important;text-align:center!important;
}

/* ══ 全站卡片 ══ */
.page-inner .panel,.page-inner .card,.page-inner .box,.page-inner .widget,
.page-inner .row>[class^="col-"],.page-inner .row>[class*=" col-"]{
    background:#fff!important;border-radius:20px!important;
    border:1px solid #F2F4F7!important;
    box-shadow:0 4px 20px rgba(0,0,0,0.04)!important;
    margin-bottom:16px!important;overflow:hidden!important;
}
.page-inner .panel-heading{
    background:#F9FAFB!important;border-bottom:1px solid #EAECF0!important;
    font-weight:700!important;color:#101828!important;
    padding:14px 20px!important;border-radius:20px 20px 0 0!important;
}
.page-inner .panel-body{padding:20px 24px!important;}
.page-inner .table-responsive{
    display:block!important;width:100%!important;
    overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;
}
.page-inner .table{border:none!important;width:100%!important;}
.page-inner .table thead tr th{
    background:#F9FAFB!important;color:#475467!important;font-size:11px!important;
    font-weight:700!important;text-transform:uppercase!important;letter-spacing:.5px!important;
    border-bottom:1px solid #EAECF0!important;padding:10px 14px!important;white-space:nowrap!important;
}
.page-inner .table tbody tr td{
    color:#344054!important;font-size:13.5px!important;
    padding:11px 14px!important;border-bottom:1px solid #F9FAFB!important;
}
.page-inner .table tbody tr:hover td{background:#F9FAFB!important;}
.page-inner .progress{border-radius:999px!important;background:#F2F4F7!important;}
.page-inner .progress-bar{border-radius:999px!important;}

/* ══ ★ 账户页（userinfo）App 化重构 ══ */
/* 移除 table-bordered / table-striped 的生硬边框 */
#user1.table-bordered,#user1.table-striped,
#user2.table-bordered,#user2.table-striped{
    border:none!important;border-collapse:separate!important;border-spacing:0 6px!important;
}
#user1 td,#user2 td{
    border:none!important;
    padding:10px 14px!important;
    vertical-align:middle!important;
    background:transparent!important;
}
#user1 tr:first-child td,#user2 tr:first-child td{border-top:none!important;}
/* 标签列 */
#user1 td:first-child,#user2 td:first-child{
    width:100px!important;font-size:13px!important;font-weight:600!important;
    color:#475467!important;white-space:nowrap!important;
}
/* ★ input 输入框美化 */
#user1 input,#user2 input,
#user1 textarea,#user2 textarea,
.page-inner #opsw,.page-inner #npsw,.page-inner #rnpsw{
    border:none!important;
    background:#F4F5F7!important;
    border-radius:12px!important;
    padding:12px 14px!important;
    font-size:13.5px!important;color:#1D2939!important;
    width:100%!important;
    outline:none!important;
    box-shadow:none!important;
    transition:background .18s,box-shadow .18s!important;
    font-family:inherit!important;
    line-height:1.55!important;
}
#user1 input:focus,#user2 input:focus,
#user1 textarea:focus,#user2 textarea:focus,
.page-inner #opsw:focus,.page-inner #npsw:focus,.page-inner #rnpsw:focus{
    background:#EBF1FF!important;
    box-shadow:0 0 0 3px rgba(0,122,255,0.13)!important;
}
/* ★ textarea 自适应高度（由 JS 配合） */
#user1 textarea,#user2 textarea{
    height:auto!important;min-height:80px!important;
    max-height:260px!important;resize:vertical!important;overflow-y:auto!important;
}
/* ★ 按钮重塑 */
.page-inner .btn-default,
.page-inner button.btn{
    background:#F0F5FF!important;
    border:none!important;
    border-radius:12px!important;
    color:#007AFF!important;
    font-size:13px!important;font-weight:600!important;
    padding:9px 18px!important;
    cursor:pointer!important;
    transition:background .15s,transform .12s!important;
    box-shadow:none!important;
}
.page-inner .btn-default:hover,
.page-inner button.btn:hover{
    background:#E0ECFF!important;transform:translateY(-1px)!important;
}
.page-inner .btn-default:active,
.page-inner button.btn:active{transform:translateY(0)!important;}
/* 危险按钮 */
.page-inner #delete_account{
    background:#FFF0F0!important;color:#E11D48!important;
}
.page-inner #delete_account:hover{background:#FFE0E0!important;}
/* 成功绿 */
.page-inner #save_info,.page-inner #save_password{
    background:#F0FFF4!important;color:#16A34A!important;
}
.page-inner #save_info:hover,.page-inner #save_password:hover{background:#DCFCE7!important;}
/* 卡片内标题 */
.page-inner .panel-body h4{
    font-size:15px!important;font-weight:700!important;color:#101828!important;
    margin:0 0 16px!important;padding:0!important;
}
/* 密钥展示行 */
#user2 td:last-child{
    font-family:ui-monospace,monospace!important;
    font-size:12px!important;color:#475467!important;
    word-break:break-all!important;white-space:normal!important;
    background:#F9FAFB!important;border-radius:8px!important;
}
/* 说明文字 */
.page-inner .panel-body b{color:#E11D48!important;}

/* ══ 聊天容器 ══ */
#app{
    flex:1 1 auto!important;width:100%!important;max-width:none!important;
    margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;
    background:transparent!important;border:none!important;box-shadow:none!important;
    border-radius:0!important;overflow:hidden!important;
    height:calc(100vh - ${TH}px)!important;
}
.messages-container{
    flex:1 1 auto!important;overflow-y:auto!important;
    padding:20px 16px 16px!important;background:transparent!important;
}
.messages-container::-webkit-scrollbar{width:4px!important;}
.messages-container::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12)!important;border-radius:9px!important;}
#messages{max-width:900px!important;margin:0 auto!important;width:100%!important;}

/* 气泡 */
.message{
    max-width:74%!important;margin:7px 0!important;padding:11px 15px!important;
    font-size:14px!important;line-height:1.68!important;position:relative!important;
}
.message.question{
    background:linear-gradient(135deg,#007AFF,#00A8FF)!important;
    color:#fff!important;font-weight:500!important;
    border-radius:20px 20px 4px 20px!important;border:none!important;
    box-shadow:0 3px 14px rgba(0,122,255,0.26)!important;
    margin-left:auto!important;margin-right:0!important;
}
.message.question p,.message.question span,
.message.question li,.message.question strong{color:#fff!important;}
.message.question a{color:#c9eeff!important;}
.message.answer{
    background:#fff!important;color:#1D2939!important;
    border-radius:20px 20px 20px 4px!important;border:1px solid #EAECF0!important;
    box-shadow:0 1px 6px rgba(0,0,0,0.06)!important;
    margin-right:auto!important;margin-left:0!important;
}
.message.answer p,.message.answer span,
.message.answer li,.message.answer td,.message.answer strong{color:#1D2939!important;}
.message.answer a{color:#007AFF!important;}
.message.answer p[style*="12px"]{
    color:#98A2B3!important;font-weight:400!important;
    border-top:1px dashed #F2F4F7!important;padding-top:6px!important;margin-top:6px!important;
}
.message pre{background:#1E1E2E!important;border-radius:10px!important;color:#F8F8F2!important;border:none!important;margin:8px 0!important;}
.message code{background:rgba(0,122,255,0.08)!important;color:#0055FF!important;border-radius:4px!important;padding:1px 5px!important;}
.message pre code{background:transparent!important;color:#F8F8F2!important;padding:0!important;}
.messages-container hr{border:none!important;border-top:1px dashed #EAECF0!important;margin:12px auto!important;max-width:900px!important;}
.messages-container center{color:#98A2B3!important;font-size:12px!important;}

/* 胶囊 */
#tc20-cap{
    max-width:900px!important;width:calc(100% - 32px)!important;
    margin:0 auto 8px!important;display:flex!important;
    align-items:center!important;gap:8px!important;flex-shrink:0!important;
}
.tc20-cw{position:relative!important;}
.tc20-cb{
    display:flex!important;align-items:center!important;gap:6px!important;
    height:32px!important;padding:0 14px!important;
    background:rgba(255,255,255,0.94)!important;
    backdrop-filter:blur(15px)!important;-webkit-backdrop-filter:blur(15px)!important;
    border-radius:25px!important;border:1px solid #EAECF0!important;
    font-size:12px!important;font-weight:600!important;color:#344054!important;
    cursor:pointer!important;white-space:nowrap!important;
    box-shadow:0 1px 4px rgba(0,0,0,0.05)!important;transition:border-color .15s,color .15s!important;
}
.tc20-cb:hover{border-color:#007AFF!important;color:#007AFF!important;}
.tc20-cc{font-size:9px!important;opacity:.4!important;}
.tc20-cbg{background:#EFF8FF!important;color:#007AFF!important;border-radius:7px!important;padding:1px 5px!important;font-size:10px!important;font-weight:700!important;}
.tc20-dd{
    display:none!important;position:absolute!important;
    bottom:calc(100% + 8px)!important;left:0!important;min-width:200px!important;
    background:rgba(255,255,255,0.97)!important;
    backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;
    border:1px solid #EAECF0!important;border-radius:14px!important;
    box-shadow:0 8px 28px rgba(0,0,0,0.11)!important;z-index:9999!important;padding:6px!important;
}
.tc20-dd.open{display:block!important;}
.tc20-ddh{font-size:10px!important;font-weight:700!important;color:#98A2B3!important;text-transform:uppercase!important;letter-spacing:.6px!important;padding:4px 10px 6px!important;}
.tc20-dds{max-height:240px!important;overflow-y:auto!important;}
.tc20-dds::-webkit-scrollbar{width:3px!important;}
.tc20-dds::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1)!important;border-radius:9px!important;}
.tc20-di{
    display:flex!important;align-items:center!important;gap:8px!important;
    padding:8px 10px!important;border-radius:9px!important;
    font-size:13px!important;font-weight:500!important;color:#344054!important;
    cursor:pointer!important;text-decoration:none!important;transition:background .13s!important;
}
.tc20-di:hover{background:#F9FAFB!important;color:#007AFF!important;}
.tc20-di.on{color:#007AFF!important;font-weight:700!important;}
.tc20-chk{margin-left:auto!important;opacity:0!important;font-size:11px!important;}
.tc20-di.on .tc20-chk{opacity:1!important;}

/* 输入包装 */
#tc20-iw{
    flex-shrink:0!important;padding:0 16px 16px!important;
    background:transparent!important;width:100%!important;
}
#tc20-iw.kb{
    position:fixed!important;left:0!important;right:0!important;
    padding:8px 16px!important;
    background:rgba(247,248,250,0.97)!important;
    backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;
    border-top:1px solid #EAECF0!important;z-index:9998!important;
}
.input-area{
    width:min(900px,100%)!important;max-width:900px!important;
    margin:0 auto!important;position:relative!important;
    left:unset!important;right:unset!important;transform:none!important;
    background:rgba(255,255,255,0.93)!important;
    backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;
    border-radius:20px!important;border:1px solid #EAECF0!important;
    box-shadow:0 4px 20px rgba(0,0,0,0.07)!important;
    padding:10px 12px!important;display:flex!important;
    align-items:center!important;gap:8px!important;
    transition:border-color .2s,box-shadow .2s!important;
}
.input-area:focus-within{
    border-color:rgba(0,122,255,0.35)!important;
    box-shadow:0 4px 20px rgba(0,122,255,0.10),0 0 0 3px rgba(0,122,255,0.07)!important;
}
textarea#input{
    flex:1!important;background:transparent!important;border:none!important;outline:none!important;
    color:#1D2939!important;font-size:14px!important;line-height:1.55!important;
    min-height:38px!important;max-height:160px!important;
    padding:2px 4px!important;resize:none!important;box-shadow:none!important;
}
textarea#input::placeholder{color:#98A2B3!important;}
textarea#input:disabled{color:#98A2B3!important;}
@keyframes tc20-pulse{
    0%,100%{box-shadow:0 3px 12px rgba(0,122,255,0.30);}
    50%{box-shadow:0 3px 22px rgba(0,198,255,0.52);}
}
button#send{
    background:linear-gradient(135deg,#007AFF,#00A8FF)!important;
    border:none!important;border-radius:14px!important;color:#fff!important;
    font-weight:700!important;font-size:13.5px!important;height:38px!important;
    padding:0 18px!important;min-width:64px!important;flex-shrink:0!important;cursor:pointer!important;
    animation:tc20-pulse 2.2s ease-in-out infinite!important;transition:transform .2s!important;
}
button#send:hover:not(:disabled){transform:scale(1.04)!important;animation-play-state:paused!important;}
button#send:active:not(:disabled){transform:scale(.95)!important;}
button#send:disabled{background:#E4E7EC!important;color:#98A2B3!important;animation:none!important;box-shadow:none!important;}
button#clear,button#file{
    width:38px!important;height:38px!important;border-radius:12px!important;
    border:1px solid #EAECF0!important;background:transparent!important;color:#667085!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    padding:0!important;cursor:pointer!important;flex-shrink:0!important;font-size:15px!important;
    transition:background .14s,border-color .14s!important;
}
button#clear:hover:not(:disabled),button#file:hover:not(:disabled){
    background:#EFF8FF!important;border-color:rgba(0,122,255,0.30)!important;color:#007AFF!important;
}
button#file[style*="rgb(0, 135, 36)"]{background:rgba(34,197,94,0.10)!important;border-color:rgba(34,197,94,0.30)!important;color:#16A34A!important;}

/* 版权区 */
#tc20-cr{
    flex-shrink:0!important;width:100%!important;padding:12px 20px!important;
    background:rgba(255,255,255,0.85)!important;border-top:1px solid #EAECF0!important;
    text-align:center!important;line-height:1.85!important;
}
#tc20-cr p{margin:0!important;font-size:11px!important;font-weight:700!important;color:#333!important;}
#tc20-cr a{color:#333!important;font-size:11px!important;font-weight:700!important;text-decoration:none!important;}
#tc20-cr a:hover{color:#007AFF!important;text-decoration:underline!important;}
.tc20-sig{color:#98A2B3!important;font-size:10px!important;font-weight:400!important;}

#tc20-badge{
    position:fixed!important;bottom:14px!important;right:16px!important;z-index:9996!important;
    background:rgba(255,255,255,0.88)!important;backdrop-filter:blur(10px)!important;
    border:1px solid rgba(0,122,255,0.18)!important;border-radius:999px!important;
    padding:3px 10px!important;font-size:10px!important;color:#007AFF!important;
    opacity:.65!important;white-space:nowrap!important;cursor:default!important;
    user-select:none!important;transition:opacity .2s!important;
}
#tc20-badge:hover{opacity:.2!important;}

/* ══ 响应式：移动端 ══ */
@media(max-width:779px){
    #tc20-sb{display:none!important;}
    body{flex-direction:column!important;padding-bottom:${BH}px!important;}
    #tc20-ham{display:flex!important;}
    .tc20-tbb{display:none!important;}
    #app{height:calc(100vh - ${TH}px - ${BH}px)!important;}
    .message{max-width:88%!important;}
    #tc20-badge{bottom:${BH + 8}px!important;}
}
    `;

    /* ══════════════════════════════════════════
       § 4  样式注入 + head 守卫
    ══════════════════════════════════════════ */
    function injectStyles() {
        let t = document.getElementById(SID);
        if (!t) { t = document.createElement('style'); t.id = SID; t.textContent = CSS; }
        const h = document.head || document.documentElement;
        if (t !== h.lastElementChild) h.appendChild(t);
    }
    injectStyles();

    const hw = setInterval(() => {
        if (!document.head) return;
        clearInterval(hw);
        new MutationObserver(() => {
            const t = document.getElementById(SID);
            if (!t) { injectStyles(); return; }
            if (t !== document.head.lastElementChild) document.head.appendChild(t);
        }).observe(document.head, { childList:true });
    }, 30);

    /* ══════════════════════════════════════════
       § 5  工具
    ══════════════════════════════════════════ */
    const here   = () => location.href;
    const actv   = k => here().includes(k) ? ' on' : '';
    const hasTc  = () => !!(document.body?.innerText?.includes('天赐'));
    const pgTitle= () => {
        const k = Object.keys(TITLES).find(k => here().includes(k)) || '';
        return TITLES[k] || 'CyberFurry';
    };
    function scrape() {
        const av = document.querySelector('.user-dropdown img,#header')?.src || '';
        const chars = [];
        document.querySelectorAll('.accordion-menu .sub-menu li a').forEach(a => {
            const lb = a.querySelector('span')?.textContent?.trim() || a.textContent.trim();
            const hr = a.getAttribute('href') || '';
            if (lb && hr) chars.push({ label:lb, href:hr });
        });
        return { av, chars };
    }

    /* ══════════════════════════════════════════
       § 6  底部导航可见性控制
    ══════════════════════════════════════════ */
    function updateBnav() {
        const bn = document.getElementById('tc20-bnav');
        if (!bn) return;
        if (mob() && shouldShowBnav()) {
            bn.classList.add('visible');
        } else {
            bn.classList.remove('visible');
        }
    }

    /* ══════════════════════════════════════════
       § 7  ★ 键盘感知
    ══════════════════════════════════════════ */
    let kbUp = false;
    function setupKeyboard() {
        if (!('visualViewport' in window)) return;
        const vp = window.visualViewport;
        let raf = null;

        function handle() {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                if (!mob()) return;
                const bn = document.getElementById('tc20-bnav');
                const iw = document.getElementById('tc20-iw');
                const mc = document.querySelector('.messages-container');
                const kbH = Math.max(0, window.innerHeight - vp.height - vp.offsetTop);
                const isKb = kbH > 60;

                if (isKb && !kbUp) {
                    kbUp = true;
                    if (bn) bn.style.setProperty('display','none','important');
                    if (iw) { iw.classList.add('kb'); iw.style.setProperty('bottom',`${kbH}px`,'important'); }
                    if (mc) {
                        const iwH = iw ? iw.offsetHeight : 70;
                        mc.style.setProperty('height',`calc(${vp.height}px - ${TH}px - ${iwH}px)`,'important');
                        const last = mc.lastElementChild;
                        if (last) last.scrollIntoView({ behavior:'smooth', block:'end' });
                    }
                } else if (!isKb && kbUp) {
                    kbUp = false;
                    if (bn) { bn.style.removeProperty('display'); updateBnav(); }
                    if (iw) { iw.classList.remove('kb'); iw.style.removeProperty('bottom'); }
                    if (mc) { mc.style.removeProperty('height'); mc.scrollTop = mc.scrollHeight; }
                }
            });
        }
        vp.addEventListener('resize', handle);
        vp.addEventListener('scroll', handle);
    }

    /* ══════════════════════════════════════════
       § 8  ★ textarea 自适应高度（账户页）
    ══════════════════════════════════════════ */
    function autoResizeTextareas() {
        document.querySelectorAll('#user1 textarea,#user2 textarea').forEach(ta => {
            if (ta.dataset.tc20auto) return;
            ta.dataset.tc20auto = '1';
            const resize = () => {
                ta.style.height = 'auto';
                ta.style.height = Math.min(260, ta.scrollHeight) + 'px';
            };
            resize();
            ta.addEventListener('input', resize);
        });
    }

    /* ══════════════════════════════════════════
       § 9  抽屉（单例）
    ══════════════════════════════════════════ */
    let drwReady = false;
    function buildDrawer() {
        if (drwReady || !document.body) return;
        drwReady = true;
        const mask = document.createElement('div'); mask.id = 'tc20-mask';
        const drw  = document.createElement('div'); drw.id  = 'tc20-drw';
        const navH = NAV.map(n => {
            if (n.sep) return `<div class="tc20-sep"></div>`;
            return `<a class="tc20-dl${actv(n.key)}" href="${n.href}"${n.blank?' target="_blank"':''}>${n.label}</a>`;
        }).join('');
        drw.innerHTML = `
            <div id="tc20-drwh">
                <span id="tc20-drwt">CyberFurry</span>
                <button id="tc20-drwc">✕</button>
            </div>
            <nav id="tc20-drwn">${navH}</nav>`;
        const close = () => { drw.classList.remove('open'); mask.classList.remove('open'); };
        mask.addEventListener('click', close, true);
        drw.querySelector('#tc20-drwc').addEventListener('click', close, true);
        document.body.appendChild(mask);
        document.body.appendChild(drw);
        window._tc20Open = () => { drw.classList.add('open'); mask.classList.add('open'); };
    }

    /* ══════════════════════════════════════════
       § 10  PC 侧边栏
    ══════════════════════════════════════════ */
    function buildSidebar(av) {
        const col = localStorage.getItem('tc20_col') === '1';
        const sb  = document.createElement('div'); sb.id = 'tc20-sb';
        if (col) sb.classList.add('col');
        const navH = NAV.map(n => {
            if (n.sep) return `<div class="tc20-sep"></div>`;
            return `<a class="tc20-nl${actv(n.key)}" href="${n.href}"${n.blank?' target="_blank"':''}>${n.label}</a>`;
        }).join('');
        const medal = hasTc() ? `<span id="tc20-medal">★ 荣誉开发者</span>` : '';

        // ★ 头像：用透明 <a> 覆盖，不触碰原站 onclick，不丢失 CSRF
        const avHtml = av
            ? `<img src="${av}" alt="">`
            : `<span style="font-size:18px;">👤</span>`;
        const userTarget = mob()
            ? 'https://chat.wingmark.cn/?page=panel&module=userinfo'
            : '/?page=panel&module=userinfo';

        sb.innerHTML = `
            <div id="tc20-sbh">
                <a id="tc20-logo" href="/?page=panel&module=chat_llmv2">
                    <div id="tc20-lmk">CF</div>
                    <div id="tc20-ltx">
                        <span id="tc20-ln">CyberFurry${medal}</span>
                        <span id="tc20-ls">${VER}</span>
                    </div>
                </a>
                <button id="tc20-tog">${col?'▶':'◀'}</button>
            </div>
            <nav id="tc20-sbn">${navH}</nav>
            <div id="tc20-sbf">
                <div id="tc20-sb-user-wrap">
                    <a class="tc20-av-link" href="${userTarget}"></a>
                    <div id="tc20-lo">
                        ${avHtml}
                        <span class="tc20-lot">账户信息</span>
                    </div>
                </div>
            </div>`;

        sb.querySelector('#tc20-tog').addEventListener('click', e => {
            e.stopPropagation();
            const n = sb.classList.toggle('col');
            e.currentTarget.textContent = n ? '▶' : '◀';
            localStorage.setItem('tc20_col', n ? '1' : '0');
        });
        return sb;
    }

    /* ══════════════════════════════════════════
       § 11  顶栏（头像用透明覆盖层）
    ══════════════════════════════════════════ */
    function buildTopbar(av) {
        const tb = document.createElement('div'); tb.id = 'tc20-tb';
        // ★ 头像：wrap + 透明 <a>，不写 onclick，不破坏 CSRF
        const avBlock = av ? `
            <div id="tc20-av-wrap">
                <a class="tc20-av-pc" href="/?page=panel&module=userinfo" title="账户信息"></a>
                <img id="tc20-av" src="${av}" alt="avatar">
            </div>` : '';

        tb.innerHTML = `
            <div id="tc20-tbl">
                <button id="tc20-ham">☰</button>
                <span id="tc20-ttl">${pgTitle()}</span>
            </div>
            <div id="tc20-tbr">
                <a class="tc20-tbb" href="/status" target="_blank">运行状态</a>
                <a class="tc20-tbb" href="/?page=panel&module=feedback">反馈</a>
                ${avBlock}
            </div>`;

        tb.querySelector('#tc20-ham').addEventListener('click', () => {
            if (typeof window._tc20Open === 'function') window._tc20Open();
            else {
                document.getElementById('tc20-drw')?.classList.add('open');
                document.getElementById('tc20-mask')?.classList.add('open');
            }
        }, true);
        return tb;
    }

    /* ══════════════════════════════════════════
       § 12  底部导航
    ══════════════════════════════════════════ */
    function buildBnav() {
        const nav = document.createElement('div'); nav.id = 'tc20-bnav';
        nav.innerHTML = BOT.map(b =>
            `<a class="tc20-bn${actv(b.key)}" href="${b.href}">
                ${b.icon}
                <span>${b.label}</span>
            </a>`
        ).join('');
        nav.querySelectorAll('.tc20-bn').forEach(a => {
            a.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href) return;
                e.stopPropagation();
                setTimeout(() => { if (location.href !== href) location.href = href; }, 40);
            }, true);
        });
        return nav;
    }

    /* ══════════════════════════════════════════
       § 13  版权区
    ══════════════════════════════════════════ */
    function buildCopyright() {
        const el = document.createElement('div'); el.id = 'tc20-cr';
        el.innerHTML = `
            <p>Copyright &copy; 2025 翎迹天算（武汉）计算机系统有限公司 &middot; Core: 7.8.5.0126 Beta Patch 4</p>
            <p>
                <a href="https://beian.miit.gov.cn" target="_blank">鄂 ICP 备 2024065334 号-2</a>
                &middot;
                <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37090202000954" target="_blank">鲁公网安备 37090202000954 号</a>
                &middot; 网信算备 330110507206401230035 号
            </p>
            <p class="tc20-sig">${VER}</p>`;
        return el;
    }

    /* ══════════════════════════════════════════
       § 14  胶囊
    ══════════════════════════════════════════ */
    function buildCapsule(chars) {
        const am  = MODELS.find(m => here().includes(m.key)) || MODELS[1];
        const bar = document.createElement('div'); bar.id = 'tc20-cap';
        bar.innerHTML = `
            <div class="tc20-cw">
                <button class="tc20-cb" data-d="tc20-dm">模型：${am.label}<span class="tc20-cc"> ▼</span></button>
                <div class="tc20-dd" id="tc20-dm">
                    <div class="tc20-ddh">切换模型</div>
                    <div class="tc20-dds">
                        ${MODELS.map(m=>`<a class="tc20-di${m.key===am.key?' on':''}" href="${m.href}">
                            ${m.label}<span class="tc20-chk">✓</span></a>`).join('')}
                    </div>
                </div>
            </div>
            ${chars.length?`
            <div class="tc20-cw">
                <button class="tc20-cb" data-d="tc20-dc2">角色<span class="tc20-cbg"> ${chars.length}</span><span class="tc20-cc"> ▼</span></button>
                <div class="tc20-dd" id="tc20-dc2">
                    <div class="tc20-ddh">角色列表</div>
                    <div class="tc20-dds">
                        ${chars.map((c,i)=>`<a class="tc20-di${i===0?' on':''}" href="${c.href}">
                            ${c.label}<span class="tc20-chk">✓</span></a>`).join('')}
                    </div>
                </div>
            </div>`:''}`;
        bar.querySelectorAll('.tc20-cb').forEach(b => {
            b.addEventListener('click', e => {
                e.stopPropagation();
                const dd = document.getElementById(b.dataset.d);
                const was = dd?.classList.contains('open');
                document.querySelectorAll('.tc20-dd').forEach(d => d.classList.remove('open'));
                if (!was && dd) dd.classList.add('open');
            });
        });
        return bar;
    }

    /* ══════════════════════════════════════════
       § 15  气泡补丁
    ══════════════════════════════════════════ */
    function pb(el) {
        if (!el || el.nodeType !== 1) return;
        if (el.classList.contains('answer')) {
            el.style.setProperty('background','#ffffff','important');
            el.style.setProperty('color','#1D2939','important');
            el.style.setProperty('border','1px solid #EAECF0','important');
            el.style.setProperty('border-radius','20px 20px 20px 4px','important');
            el.querySelectorAll('p:not([style*="12px"]),span,li,td,strong')
              .forEach(c => c.style.setProperty('color','#1D2939','important'));
        }
        if (el.classList.contains('question')) {
            el.style.setProperty('background','linear-gradient(135deg,#007AFF,#00A8FF)','important');
            el.style.setProperty('color','#fff','important');
            el.style.setProperty('border','none','important');
            el.style.setProperty('border-radius','20px 20px 4px 20px','important');
            el.querySelectorAll('p,span,li,strong,em')
              .forEach(c => c.style.setProperty('color','#fff','important'));
        }
    }
    const patchAll = () => document.querySelectorAll('.message').forEach(pb);

    /* ══════════════════════════════════════════
       § 16  主组装
    ══════════════════════════════════════════ */
    let chatDone = false;

    function assemble() {
        if (!document.body) return;
        const { av, chars } = scrape();

        buildDrawer();

        if (!document.getElementById('tc20-sb')) {
            document.body.insertBefore(buildSidebar(av), document.body.firstChild);
        }

        if (!document.getElementById('tc20-bnav')) {
            document.body.appendChild(buildBnav());
        }
        updateBnav();

        const pi = document.querySelector('.page-inner');
        if (pi && !document.getElementById('tc20-tb')) {
            pi.insertBefore(buildTopbar(av), pi.firstChild);
        }
        if (pi && !document.getElementById('tc20-cr')) {
            pi.appendChild(buildCopyright());
        }

        if (!document.getElementById('tc20-badge')) {
            const b = document.createElement('div'); b.id = 'tc20-badge'; b.textContent = 'TC v20.0';
            document.body.appendChild(b);
        }

        // ★ 账户页 textarea 自适应高度
        autoResizeTextareas();

        const app = document.getElementById('app');
        if (app && !chatDone && app.querySelector('.messages-container')) {
            chatDone = true;
            document.addEventListener('click', () =>
                document.querySelectorAll('.tc20-dd').forEach(d => d.classList.remove('open')));

            const ia = document.querySelector('.input-area');
            if (ia && !document.getElementById('tc20-iw')) {
                const wrap = document.createElement('div'); wrap.id = 'tc20-iw';
                ia.parentNode.insertBefore(wrap, ia);
                wrap.appendChild(buildCapsule(chars));
                wrap.appendChild(ia);
            }

            patchAll();
            setupKeyboard();

            const mr = document.getElementById('messages');
            if (mr) {
                new MutationObserver(ms => {
                    ms.forEach(({ addedNodes:ns }) => ns.forEach(n => {
                        if (n.nodeType !== 1) return;
                        if (n.classList?.contains('message')) requestAnimationFrame(() => pb(n));
                        n.querySelectorAll?.('.message').forEach(m => requestAnimationFrame(() => pb(m)));
                    }));
                }).observe(mr, { childList:true, subtree:true });
            }
        }
    }

    /* ══════════════════════════════════════════
       § 17  持久守卫
    ══════════════════════════════════════════ */
    function startGuard() {
        new MutationObserver(() => assemble())
            .observe(document.body, { childList:true, subtree:false });

        setInterval(() => {
            if (!document.getElementById('tc20-sb')) { chatDone = false; assemble(); }
            if (document.getElementById('app') && !document.getElementById('tc20-cap')) {
                chatDone = false; assemble();
            }
            autoResizeTextareas();
            updateBnav();
            patchAll();
            injectStyles();
        }, 500);

        let last = location.href;
        setInterval(() => {
            if (location.href === last) return;
            last = location.href;
            chatDone = false;
            ['tc20-tb','tc20-cr','tc20-cap','tc20-iw','tc20-bnav']
                .forEach(id => document.getElementById(id)?.remove());
            setTimeout(assemble, 280);
        }, 200);

        window.addEventListener('resize', updateBnav);
    }

    /* ══════════════════════════════════════════
       § 18  启动
    ══════════════════════════════════════════ */
    if (document.body) {
        assemble(); startGuard();
    } else {
        document.addEventListener('DOMContentLoaded', () => { assemble(); startGuard(); });
    }
    window.addEventListener('load', () => { assemble(); patchAll(); autoResizeTextareas(); });

})();
