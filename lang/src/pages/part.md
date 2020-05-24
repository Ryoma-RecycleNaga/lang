<meta>
    <description> General template for parts being produced </description>
</meta>

<part_header>

**Parent** : {PART_PARENT}

**Name** : <%%PARTNAME%%> | <a href="<%PART_EDIT%>/?<%PART_EDIT_ARGS%>">Edit</a>

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

<tools>
    <%PART_TOOLS%>
</tools>

**Stock**

<stock>
    <%PART_STOCK%>
</stock>

**Machines**

<machines>
    <%PART_MACHINES%>
</machines>

<hr/>

**Steps** :

<steps>
    <%PART_STEPS%>
</steps>

</part_header>

<templates>
    <template for="list">
        <%PART_ID%> | <%PART_NAME%> | <a href="<%PART_DRAWING%>">Drawing</a> |
    </template>
</templates>
