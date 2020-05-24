<meta>
    <description> General template for parts being produced </description>
</meta>

<pp-partheader>

**Parent** : <%PART_PARENT%>

**Name** : <%PART_NAME%> | <a href="<%PART_EDIT%>/?<%PART_EDIT_ARGS%>">Edit</a>

**Version** : <%PART_VERSION%> | <%PART_VERSIONS%>

**ID** : <%PART_ID%> | <a href="<%PART_INVENTORY%">Inventory</a>

**Drawing** : <a href="<%PART_DRAWING%>">Fusion360 public link</a>

**Preview**

<img width="20%" src"<%PART_PREVIEW_IMAGE%>"></img>

<hr/>

**Comaptible with** : <%PART_COMPAT%>

**Capabilities** : <%PART_CAPS%>

<hr/>

**Assembly** : <a href="<%PART_ASSEMBLY%>">Fusion360 public link</a>

**Tools**

<pp-tools>
    <%PART_TOOLS%>
</pp-tools>

**Templates / Gauges**

<pp-templates>
    <%PART_TEMPLATES%>
<pp-templates>

**Stock**

<pp-stock>
    <%PART_STOCK%>
</pp-stock>

**Machines**

<pp-machines>
    <%PART_MACHINES%>
</pp-machines>

<hr/>

**Steps** :

<pp-steps>
    <%PART_STEPS%>
</pp-steps>

</pp-partheader>

<templates>
    <template for="list">
        <%PART_ID%> | <%PART_NAME%> | <a href="<%PART_DRAWING%>">Drawing</a> |
    </template>
</templates>
